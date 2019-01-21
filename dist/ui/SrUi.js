var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CommonMessages } from "../messaging/Messaging";
import { NavigationTarget } from "../navigation/Navigation";
import { Log, LogLevel, runtime } from "../framework/Framework";
import * as ReactDOM from "react-dom";
import * as React from "react";
export default class SrUi {
    constructor() {
        this.overlayVisible = false;
        this.currentView = null;
        this.navigationHandlers = [];
        this.lastViewType = null;
        this.lastViewId = null;
        this.lastQuery = null;
        this.asyncTimeout = null;
        this.defaultLocation = null;
        this.basePath = null;
        this.rootElement = null;
    }
    initialize(uiInit) {
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
    handles() {
        return [CommonMessages.AppReady, CommonMessages.ApiInitialized, CommonMessages.ApiInitializationFailed];
    }
    receiveMessage(msg) {
        if (msg.action === CommonMessages.ApiInitialized && !msg.data) {
            runtime.messaging.broadcast(CommonMessages.AppReady);
        }
        if (msg.action === CommonMessages.AppReady || msg.action === CommonMessages.ApiInitializationFailed) {
            this.handleInitialization(msg.action === CommonMessages.AppReady);
        }
    }
    appBasePath() {
        return this.basePath;
    }
    configureUi(uiInit) {
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
        runtime.messaging.registerHandler(this);
    }
    handleInitialization(success) {
        Log.t(this, "API initialization callback", { success: success });
        if (success) {
            this.configurer.appReady();
            this.loadCurrentUrl();
        }
        else {
            Log.e(this, "Unable to load proper UI due to API initialization failure.");
            this.configurer.appInitFailed();
        }
    }
    loadCurrentUrl() {
        this.onAppLocationChanged(this.getCurrentLocation(false), null, null, true);
    }
    getCurrentLocation(replacePrefix = true) {
        var path = window.location.pathname;
        if (replacePrefix) {
            path = path.replace("/" + this.basePath + "/", "").replace("/" + this.basePath, "");
        }
        return path + window.location.search;
    }
    setupInitialUi(uiInit) {
        Log.t(this, "Setting up initial UI");
        uiInit.appInitializing();
    }
    setupHandlers(uiInit) {
        var handlers = uiInit.navigationHandlers();
        (handlers || []).forEach((h) => {
            this.registerHandler(h);
        });
    }
    registerHandler(handler) {
        this.navigationHandlers.push(handler);
    }
    onAppLocationChanged(path, data, title, fromPopOrManual) {
        Log.t(this, "App location changed", { path: path, pop: fromPopOrManual });
        var nav = this.getNavigationTarget(path, data);
        this.performNavigation(nav, data, title, fromPopOrManual);
    }
    getNavigationTarget(loc, data) {
        var nav = new NavigationTarget();
        nav.original = loc;
        nav.data = data;
        loc = loc.replace("/" + this.basePath + "/", "").replace("/" + this.basePath, "").replace("#!", "");
        Log.d(this, "Navigation target location", { location: loc });
        var queryIdx = loc.indexOf("?");
        var query = null;
        if (queryIdx !== -1) {
            query = loc.substr(queryIdx + 1);
            loc = loc.substr(0, loc.length - (loc.length - queryIdx));
            Log.d(this, "Nav query", { query: query, newLocation: loc });
        }
        var targets = loc.split("/").filter((s) => { return ((s || "").trim().length > 0); });
        nav.paths = targets;
        if (query !== null) {
            var options = query.split("&");
            options.forEach((op) => {
                var kvp = op.split("=");
                if (kvp.length === 2) {
                    nav.query[kvp[0]] = decodeURIComponent((kvp[1] || "").toString());
                }
            });
        }
        return nav;
    }
    onWindowResized(e) {
        if (runtime.config.loggingLevel <= LogLevel.Trace) {
            Log.t(this, "Window resized", { width: window.innerWidth, height: window.innerHeight });
        }
    }
    isOverlayOpen() {
        return this.overlayVisible;
    }
    performNavigation(nav, data, title, fromPopOrManual) {
        Log.d(this, "Performing navigation", { target: nav, data: data, title: title, fromPop: fromPopOrManual });
        if (nav == null) {
            this.navigate(this.getDefaultLocation());
            return;
        }
        var view = null;
        var viewType = null, viewId = null;
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
            }
            else {
                Log.e(this, "Unknown navigation target");
            }
            return;
        }
        Log.t(this, "View transition", { lastViewType: this.lastViewType, lastViewId: this.lastViewId, newViewType: viewType, newViewId: viewId });
        let query = `?${Object.keys(nav.query || {}).sort((k1, k2) => { return k1.localeCompare(k2); }).map((k) => { return `${k}=${nav.query[k]}`; }).join("&")}}`;
        if (viewType === this.lastViewType && viewId !== this.lastViewId) {
            this.performNavigationChange(title, view, nav.original, fromPopOrManual, true);
            this.setLastViewInfo(viewType, viewId, query);
            return;
        }
        let newQuery = false;
        if (viewType === this.lastViewType && viewId === this.lastViewId) {
            if (query !== this.lastQuery) {
                newQuery = true;
            }
            else {
                Log.d(this, "Same view type and ID - not changing");
                return;
            }
        }
        this.setLastViewInfo(viewType, viewId, query);
        this.performNavigationChange(title, view, nav.original, fromPopOrManual, false, newQuery);
    }
    setLastViewInfo(type, id, query) {
        this.lastViewType = type;
        this.lastViewId = id;
        this.lastQuery = query;
    }
    updateQuery(query) {
        Log.d(this, "Updating query", { query: query, location: window.location.pathname });
        if (this.configurer.urlNavigationEnabled()) {
            history.pushState({}, document.title, window.location.pathname + "?" + query);
        }
        if (this.configurer.navigateOnQueryChange()) {
            this.onAppLocationChanged(this.getCurrentLocation(false), null, null, true);
        }
    }
    performNavigationChange(title, view, originalNav, fromPopOrManual, isAsyncReplace = false, onlyQueryUpdated = false) {
        var stateTitle = (title != null && title.length > 0 ? title + " - " : "") + this.appTitle;
        document.title = stateTitle;
        if (!fromPopOrManual && this.configurer.urlNavigationEnabled()) {
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
    changeView(view, onlyQueryUpdated = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentView = view;
            if (view == null) {
                ReactDOM.render(React.createElement("div", { className: "no-view" }), document.getElementById(this.rootElement));
                return;
            }
            let viewRender = view;
            if (React.isValidElement(this.containerElement)) {
                viewRender = React.cloneElement(this.containerElement, this.containerElement.props, view);
            }
            let render;
            if (this.viewRenderer) {
                render = this.viewRenderer(this.headerElement, viewRender, this.footerElement);
            }
            else {
                render = React.createElement(React.Fragment, null,
                    this.headerElement,
                    viewRender,
                    this.footerElement);
            }
            ReactDOM.render(render, document.getElementById(this.rootElement));
        });
    }
    getDefaultLocation() {
        return this.defaultLocation;
    }
    navigate(appUrl, title, data) {
        this.onAppLocationChanged("/" + this.basePath + "/" + appUrl, data, title);
    }
    showOverlay() {
        return __awaiter(this, void 0, void 0, function* () {
            Log.d(this, "Showing overlay");
            runtime.messaging.broadcast(CommonMessages.OverlayOpening);
        });
    }
    hideOverlay() {
        return __awaiter(this, void 0, void 0, function* () {
            Log.d(this, "Hiding overlay");
            runtime.messaging.broadcast(CommonMessages.OverlayClosed);
        });
    }
}
//# sourceMappingURL=SrUi.js.map