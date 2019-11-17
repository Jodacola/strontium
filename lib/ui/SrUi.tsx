import * as ReactDOM from "react-dom";
import * as React from "react";
import INavigationHandler from "../navigation/INavigationHandler";
import NavigationTarget from "../navigation/NavigationTarget";
import IMessageHandler from "../messaging/IMessageHandler";
import IUiInitializer from "../config/IUiInitializer";
import CommonMessages from "../messaging/CommonMessages";
import SrAppMessage from "../messaging/SrAppMessage";
import { runtime } from "../framework/SrApp";
import Log from "../framework/Log";

export default class SrUi implements IMessageHandler {
    private overlayVisible = false;
    private currentView: JSX.Element = null;
    private navigationHandlers: INavigationHandler[] = [];
    private lastViewType: string = null;
    private lastViewId: string = null;
    private lastQuery: string = null;
    private defaultLocation: string = null;
    private basePath: string = null;
    private rootElement: string = null;
    private urlNavigationEnabled: boolean;
    private appTitle: string;
    private configurer: IUiInitializer;
    private footerElement: React.ReactNode | React.ReactNode[];
    private headerElement: React.ReactNode | React.ReactNode[];
    private containerElement: React.ReactNode;
    private viewRenderer: (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any>;
    private renderer: (element: React.ReactElement<any>) => void = undefined;
    private _initialized: boolean = false;

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

        this.configureUi(uiInit);
        this.setupInitialUi(uiInit);
        this.setupHandlers(uiInit);
    }

    handles(): string[] {
        return [CommonMessages.AppReady, CommonMessages.AppLaunch, CommonMessages.ApiInitialized, CommonMessages.ApiInitializationFailed];
    }

    receiveMessage(msg: SrAppMessage): void {
        if (msg.action === CommonMessages.ApiInitialized && !msg.data) {
            runtime.messaging.broadcast(CommonMessages.AppReady);
        }

        if (msg.action === CommonMessages.AppLaunch || msg.action === CommonMessages.ApiInitializationFailed) {
            this.handleInitialization(msg.action === CommonMessages.AppLaunch);
        }
    }

    public initialized() {
        return this._initialized;
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
        this.headerElement = uiInit.headerElement();
        this.viewRenderer = uiInit.viewRenderer();
        this.footerElement = uiInit.footerElement();
        this.containerElement = uiInit.containerElement();
        this.renderer = uiInit.internalRenderer();
        runtime.messaging.registerHandler(this);
    }

    private handleInitialization(success: boolean) {
        Log.t(this, "API initialization callback", { success: success });
        if (success) {
            this.configurer.appReady();
            this.loadCurrentUrl();
            this._initialized = true;
        } else {
            Log.e(this, "Unable to load proper UI due to API initialization failure.");
            this.configurer.appInitFailed();
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

    private setupInitialUi(uiInit: IUiInitializer): void {
        Log.t(this, "Setting up initial UI");
        uiInit.appInitializing();
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

    private onAppLocationChanged(path: string, data?: any, title?: string, fromPopOrManual?: boolean) {
        Log.t(this, "App location changed", { path: path, pop: fromPopOrManual });
        var nav = new NavigationTarget(path, data, this.basePath);
        this.performNavigation(nav, data, title, fromPopOrManual);
    }

    public isOverlayOpen(): boolean {
        return this.overlayVisible;
    }

    private performNavigation(nav: NavigationTarget, data?: any, title?: string, fromPopOrManual?: boolean) {
        Log.d(this, "Performing navigation", { target: nav, data: data, title: title, fromPop: fromPopOrManual });
        if (nav == null) {
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
                viewId = nav.dataIdentifier();
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
            this.performNavigationChange(title, view, nav.original, fromPopOrManual);
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
        this.performNavigationChange(title, view, nav.original, fromPopOrManual, newQuery);
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
        if (this.configurer.navigateOnQueryChange()) {
            this.onAppLocationChanged(this.getCurrentLocation(false), null, null, true);
        }
    }

    private performNavigationChange(title: string, view: JSX.Element, originalNav: string, fromPopOrManual?: boolean, onlyQueryUpdated: boolean = false) {
        var stateTitle = (title != null && title.length > 0 ? title + " - " : "") + this.appTitle;
        document.title = stateTitle;

        if (!fromPopOrManual && this.configurer.urlNavigationEnabled()) {
            history.pushState({}, stateTitle, originalNav);
        }

        this.changeView(view, onlyQueryUpdated);
    }

    public async changeView(view: JSX.Element, onlyQueryUpdated: boolean = false) {
        this.currentView = view;
        if (view == null) {
            this.render(<div className="no-view" />);
            return;
        }

        let viewRender = view;
        if (React.isValidElement(this.containerElement)) {
            viewRender = React.cloneElement(this.containerElement, this.containerElement.props, view);
        }

        let render: React.ReactElement<any>;
        if (this.viewRenderer) {
            render = this.viewRenderer(viewRender, this.headerElement, this.footerElement);
        } else {
            render = <React.Fragment>
                {this.headerElement}
                {viewRender}
                {this.footerElement}
            </React.Fragment>;
        }
        this.render(render);
    }

    private render(element: React.ReactElement<any>) {
        if (this.renderer) {
            this.renderer(element);
        } else {
            ReactDOM.render(element, document.getElementById(this.rootElement));
        }
    }

    private getDefaultLocation(): string {
        return this.defaultLocation;
    }

    public navigate(appUrl: string, title?: string, data?: any) {
        this.onAppLocationChanged("/" + this.basePath + "/" + appUrl, data, title);
    }

    public async showOverlay() {
        Log.d(this, "Showing overlay");
        runtime.messaging.broadcast(CommonMessages.OverlayOpening);
    }

    public async hideOverlay() {
        Log.d(this, "Hiding overlay");
        runtime.messaging.broadcast(CommonMessages.OverlayClosed);
    }
}
