export default class StrontiumUiConfig {
    constructor(options) {
        this._navHandlers = null;
        this._defaultLocation = options.defaultLocation;
        this._basePath = options.basePath;
        this._rootElement = options.rootElement;
        this._urlNavEnabled = options.urlNavEnabled === true;
        this._navigateOnQueryChange = options.navigateOnQueryChange === true;
        this._appTitle = options.appTitle;
        this._appReady = options.appReady;
        this._appInitializing = options.appInitializing;
        this._appInitFailed = options.appInitFailed;
        this._navHandlers = options.navHandlers;
        this._footerElement = options.footerElement;
        this._headerElement = options.headerElement;
        this._viewRenderer = options.viewRenderer;
        this._containerElement = options.containerElement;
        this._internalRenderer = options.internalRenderer;
    }
    defaultLocation() {
        return this._defaultLocation;
    }
    basePath() {
        return this._basePath;
    }
    rootElement() {
        return this._rootElement;
    }
    urlNavigationEnabled() {
        return this._urlNavEnabled;
    }
    navigateOnQueryChange() {
        return this._navigateOnQueryChange;
    }
    appInitializing() {
        if (this._appInitializing) {
            this._appInitializing();
        }
    }
    appReady() {
        if (this._appReady) {
            this._appReady();
        }
    }
    appInitFailed() {
        if (this._appInitFailed) {
            this._appInitFailed();
        }
    }
    navigationHandlers() {
        return this._navHandlers || [];
    }
    appTitle() {
        return this._appTitle;
    }
    footerElement() {
        return this._footerElement;
    }
    headerElement() {
        return this._headerElement;
    }
    containerElement() {
        return this._containerElement;
    }
    viewRenderer() {
        return this._viewRenderer;
    }
    internalRenderer() {
        return this._internalRenderer;
    }
}
//# sourceMappingURL=StrontiumUiConfig.js.map