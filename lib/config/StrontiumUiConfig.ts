import { IUiInitializer, INavigationHandler } from "../lib";
import NavigationTarget from "../navigation/NavigationTarget";

export default class StrontiumUiConfig implements IUiInitializer {
    private _defaultLocation: string;
    private _basePath: string;
    private _rootElement: string;
    private _urlNavEnabled: boolean;
    private _appTitle: string;
    private _navHandlers: INavigationHandler[] = null;
    private _appReady: () => void;
    private _appInitFailed: () => void;
    private _appInitializing: () => void;

    constructor(
        defaultLocation: string,
        basePath: string,
        rootElement: string,
        urlNavEnabled: boolean,
        appTitle: string,
        appReady: () => void,
        appInitFailed: () => void,
        appInitializing: () => void,
        navHandlers: INavigationHandler[]
    ) {
        this._defaultLocation = defaultLocation;
        this._basePath = basePath;
        this._rootElement = rootElement;
        this._urlNavEnabled = urlNavEnabled === true;
        this._appTitle = appTitle;
        this._appReady = appReady;
        this._appInitializing = appInitializing;
        this._appInitFailed = appInitFailed;
        this._navHandlers = navHandlers;
    }

    public defaultLocation(): string {
        return this._defaultLocation;
    }

    public basePath(): string {
        return this._basePath;
    }

    public rootElement(): string {
        return this._rootElement;
    }

    public urlNavigationEnabled(): boolean {
        return this._urlNavEnabled;
    }

    public appInitializing(): void {
        if (this._appInitializing) {
            this._appInitializing();
        }
    }

    public appReady(): void {
        if (this._appReady) {
            this._appReady();
        }
    }

    public appInitFailed(): void {
        if (this._appInitFailed) {
            this._appInitFailed();
        }
    }

    public navigationHandlers(): INavigationHandler[] {
        return this._navHandlers || [];
    }

    public appTitle(): string {
        return this._appTitle;
    }
}