import { IMessageHandler, CommonMessages, SrAppMessage } from "../messaging/Messaging";
import { NavigationTarget, INavigationHandler } from "../navigation/Navigation";
import { Log, LogLevel, runtime } from "../framework/Framework";
import { IUiInitializer } from "../config/Config";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { GeneralUtility as Utils } from "../utils/Utils";
import uuid from "uuid";
import TransitionGroup from "react-transition-group";

export default class SrUi implements IMessageHandler {
    private resizeHandler: EventListener = null;
    private overlayVisible = false;
    private initialized: boolean = false;
    private currentView: JSX.Element = null;
    private overlayFading: boolean = false;
    private navigationHandlers: INavigationHandler[] = [];
    private lastViewType: string = null;
    private lastViewId: string = null;
    private lastQuery: string = null;
    private asyncTimeout: number = null;
    private defaultLocation: string = null;
    private basePath: string = null;
    private rootElement: string = null;
    private urlNavigationEnabled: boolean;
    private appTitle: string;
    private configurer: IUiInitializer;

    public initialize(uiInit: IUiInitializer): void {
        if (uiInit == null) {
            Log.e(this, "Invalid UI initializer supplied.  Cannot initialize UI.");
            return;
        }
        window.onpopstate = () => {
            if (!this.urlNavigationEnabled) {
                return;
            }
            Log.t(this, "State popped");
            this.onAppLocationChanged(this.getCurrentLocation(false), null, null, true);
        };

        this.resizeHandler = (e: Event) => { this.onWindowResized(e); };
        this.configureUi(uiInit);
        this.setupInitalUi(uiInit);
        this.setupHandlers(uiInit);
    }

    handles(): string[] {
        return [];
    }

    handlesLocal(): string[] {
        return [CommonMessages.AppReady, CommonMessages.ApiInitializationFailed];
    }

    receiveMessage(msg: SrAppMessage): void {
        if (msg.action === CommonMessages.AppReady || msg.action === CommonMessages.ApiInitializationFailed) {
            this.handleInitialization(msg.action === CommonMessages.AppReady);
        }
    }

    public appBasePath() {
        return this.basePath;
    }

    private configureUi(uiInit: IUiInitializer): void {
        this.configurer = uiInit;
        this.defaultLocation = uiInit.defaultLocation();
        this.basePath = uiInit.basePath();
        this.rootElement = uiInit.rootElement();
        this.urlNavigationEnabled = uiInit.urlNavigationEnabled();
        this.appTitle = uiInit.appTitle();
        runtime.messaging.registerHandler(this);
    }

    private handleInitialization(success: boolean) {
        Log.t(this, "API initialization callback", { success: success });
        if (success) {
            this.configurer.setupAppReadyUi();
            this.loadCurrentUrl();
        } else {
            Log.e(this, "Unable to load proper UI due to API initialization failure.");
        }
    }

    private loadCurrentUrl() {
        this.onAppLocationChanged(this.getCurrentLocation(false), null, null, true);
    }

    private getCurrentLocation(replacePrefix: boolean = true): string {
        var path = window.location.pathname;
        if (replacePrefix) {
            path = path.replace("/" + this.basePath + "/", "").replace("/" + this.basePath, "");
        }
        return path + window.location.search;
    }

    private setupInitalUi(uiInit: IUiInitializer): void {
        Log.t(this, "Setting up initial UI");
        uiInit.setupInitialUi();
    }

    private setupHandlers(uiInit: IUiInitializer): void {
        var handlers: INavigationHandler[] = uiInit.navigationHandlers();
        (handlers || []).forEach((h: INavigationHandler) => {
            this.registerHandler(h);
        });
    }

    private registerHandler(handler: INavigationHandler) {
        this.navigationHandlers.push(handler);
    }

    private onAppLocationChanged(path: string, data?: any, title?: string, fromPop?: boolean) {
        Log.t(this, "App location changed", { path: path, pop: fromPop });
        var nav = this.getNavigationTarget(path, data);
        this.performNavigation(nav, data, title, fromPop);
    }

    private getNavigationTarget(loc: string, data: any): NavigationTarget {
        var nav = new NavigationTarget();
        nav.original = loc;
        nav.data = data;
        loc = loc.replace("/" + this.basePath + "/", "").replace("/" + this.basePath, "").replace("#!", "");
        Log.d(this, "Navigation target location", { location: loc });
        var queryIdx = loc.indexOf("?");
        var query: string = null;
        if (queryIdx !== -1) {
            query = loc.substr(queryIdx + 1);
            loc = loc.substr(0, loc.length - (loc.length - queryIdx));
            Log.d(this, "Nav query", { query: query, newLocation: loc });
        }
        var targets: string[] = loc.split("/").filter((s) => { return ((s || "").trim().length > 0); });
        nav.paths = targets;
        if (query !== null) {
            var options: string[] = query.split("&");
            options.forEach((op: string) => {
                var kvp = op.split("=");
                if (kvp.length === 2) {
                    nav.query[kvp[0]] = decodeURIComponent((kvp[1] || "").toString());
                }
            });
        }
        return nav;
    }

    private onWindowResized(e: Event): void {
        if (runtime.config.loggingLevel <= LogLevel.Trace) {
            Log.t(this, "Window resized", { width: window.innerWidth, height: window.innerHeight });
        }
    }

    public isOverlayOpen(): boolean {
        return this.overlayVisible;
    }

    private performNavigation(nav: NavigationTarget, data?: any, title?: string, fromPop?: boolean) {
        Log.d(this, "Performing navigation", { target: nav, data: data, title: title, fromPop: fromPop });
        if (nav == null || nav.paths.length === 0) {
            this.navigate(this.getDefaultLocation());
            return;
        }

        var view: JSX.Element = null;
        var viewType: string = null, viewId: string = null;

        this.navigationHandlers.forEach((h) => {
            if (h.handlesType(nav)) {
                view = h.buildElement(nav);
                title = h.getTitle(nav);
                viewType = h.typeIdentifier();
                viewId = h.dataIdentifier(nav);
            }
        });

        if (view == null) {
            if (this.currentView == null) {
                this.navigate(this.getDefaultLocation());
            } else {
                Log.e(this, "Unknown navigation target");
            }
            return;
        }

        Log.t(this,
            "View transition",
            { lastViewType: this.lastViewType, lastViewId: this.lastViewId, newViewType: viewType, newViewId: viewId });

        let query = `?${Object.keys(nav.query || {}).sort((k1, k2) => { return k1.localeCompare(k2); }).map((k) => { return `${k}=${nav.query[k]}`; }).join("&")}}`;

        if (viewType === this.lastViewType && viewId !== this.lastViewId) {
            this.performNavigationChange(title, view, nav.original, fromPop, true);
            this.setLastViewInfo(viewType, viewId, query);
            return;
        }

        let newQuery: boolean = false;
        if (viewType === this.lastViewType && viewId === this.lastViewId) {
            if (query !== this.lastQuery) {
                newQuery = true;
            } else {
                Log.d(this, "Same view type and ID - not changing");
                return;
            }
        }

        this.setLastViewInfo(viewType, viewId, query);
        this.performNavigationChange(title, view, nav.original, fromPop, false, newQuery);
    }

    private setLastViewInfo(type: string, id: string, query: string) {
        this.lastViewType = type;
        this.lastViewId = id;
        this.lastQuery = query;
    }

    public updateQuery(query: string): void {
        Log.d(this, "Updating query", { query: query, location: window.location.pathname });
        if (this.configurer.urlNavigationEnabled()) {
            history.pushState({}, document.title, window.location.pathname + "?" + query);
        }
    }

    private performNavigationChange(title: string, view: JSX.Element, originalNav: string, fromPop?: boolean, isAsyncReplace: boolean = false, onlyQueryUpdated: boolean = false) {
        var stateTitle = (title != null && title.length > 0 ? title + " - " : "") + this.appTitle;
        document.title = stateTitle;

        if (!fromPop && this.configurer.urlNavigationEnabled()) {
            history.pushState({}, stateTitle, originalNav);
        }

        if (isAsyncReplace) {
            this.changeView(null);
            if (this.asyncTimeout != null) {
                clearTimeout(this.asyncTimeout);
            }
            this.asyncTimeout = window.setTimeout(() => {
                this.changeView(view);
            }, 100);
            return;
        }
        this.changeView(view, onlyQueryUpdated);
    }

    public async changeView(view: JSX.Element, onlyQueryUpdated: boolean = false) {
        this.currentView = view;
        if (view == null) {
            ReactDOM.render(<div className="no-view" />, document.getElementById(this.rootElement));
            return;
        }
        ReactDOM.render(view, document.getElementById(this.rootElement));
    }

    private getDefaultLocation(): string {
        return this.defaultLocation;
    }

    public navigate(appUrl: string, title?: string, data?: any) {
        this.onAppLocationChanged("/" + this.basePath + "/" + appUrl, data, title);
    }

    public async showOverlay() {
        Log.d(this, "Showing overlay");
        runtime.messaging.broadcastLocal(CommonMessages.OverlayOpening);
    }

    public async hideOverlay() {
        Log.d(this, "Hiding overlay");
        runtime.messaging.broadcastLocal(CommonMessages.OverlayClosed);
    }
}
