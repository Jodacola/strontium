var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as ReactDOM from "react-dom";
import * as React from "react";
import NavigationTarget from "../navigation/NavigationTarget";
import CommonMessages from "../messaging/CommonMessages";
import { runtime } from "../framework/SrApp";
import Log from "../framework/Log";
export default class SrUi {
    constructor() {
        this.overlayVisible = false;
        this.currentView = null;
        this.navigationHandlers = [];
        this.lastViewType = null;
        this.lastViewId = null;
        this.lastQuery = null;
        this.defaultLocation = null;
        this.basePath = null;
        this.rootElement = null;
        this.renderer = undefined;
        this._initialized = false;
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
        return [CommonMessages.AppReady, CommonMessages.AppLaunch, CommonMessages.ApiInitialized, CommonMessages.ApiInitializationFailed];
    }
    receiveMessage(msg) {
        if (msg.action === CommonMessages.ApiInitialized && !msg.data) {
            runtime.messaging.broadcast(CommonMessages.AppReady);
        }
        if (msg.action === CommonMessages.AppLaunch || msg.action === CommonMessages.ApiInitializationFailed) {
            this.handleInitialization(msg.action === CommonMessages.AppLaunch);
        }
    }
    initialized() {
        return this._initialized;
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
        this.renderer = uiInit.internalRenderer();
        runtime.messaging.registerHandler(this);
    }
    handleInitialization(success) {
        Log.t(this, "API initialization callback", { success: success });
        if (success) {
            this.configurer.appReady();
            this.loadCurrentUrl();
            this._initialized = true;
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
        var nav = new NavigationTarget(path, data, this.basePath);
        this.performNavigation(nav, data, title, fromPopOrManual);
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
                viewId = nav.dataIdentifier();
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
            this.performNavigationChange(title, view, nav.original, fromPopOrManual);
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
        this.performNavigationChange(title, view, nav.original, fromPopOrManual, newQuery);
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
    performNavigationChange(title, view, originalNav, fromPopOrManual, onlyQueryUpdated = false) {
        var stateTitle = (title != null && title.length > 0 ? title + " - " : "") + this.appTitle;
        document.title = stateTitle;
        if (!fromPopOrManual && this.configurer.urlNavigationEnabled()) {
            history.pushState({}, stateTitle, originalNav);
        }
        this.changeView(view, onlyQueryUpdated);
    }
    changeView(view, onlyQueryUpdated = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentView = view;
            if (view == null) {
                this.render(React.createElement("div", { className: "no-view" }));
                return;
            }
            let viewRender = view;
            if (React.isValidElement(this.containerElement)) {
                viewRender = React.cloneElement(this.containerElement, this.containerElement.props, view);
            }
            let render;
            if (this.viewRenderer) {
                render = this.viewRenderer(viewRender, this.headerElement, this.footerElement);
            }
            else {
                render = React.createElement(React.Fragment, null,
                    this.headerElement,
                    viewRender,
                    this.footerElement);
            }
            this.render(render);
        });
    }
    render(element) {
        if (this.renderer) {
            this.renderer(element);
        }
        else {
            ReactDOM.render(element, document.getElementById(this.rootElement));
        }
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