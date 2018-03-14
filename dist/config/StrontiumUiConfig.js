export default class StrontiumUiConfig {
    constructor(defaultLocation, basePath, rootElement, urlNavEnabled, navigateOnQueryChange, appTitle, appReady, appInitFailed, appInitializing, navHandlers) {
        this._navHandlers = null;
        this._defaultLocation = defaultLocation;
        this._basePath = basePath;
        this._rootElement = rootElement;
        this._urlNavEnabled = urlNavEnabled === true;
        this._navigateOnQueryChange = navigateOnQueryChange === true;
        this._appTitle = appTitle;
        this._appReady = appReady;
        this._appInitializing = appInitializing;
        this._appInitFailed = appInitFailed;
        this._navHandlers = navHandlers;
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
}
//# sourceMappingURL=StrontiumUiConfig.js.map