import { IUiInitializer, INavigationHandler } from "../lib";
export default class StrontiumUiConfig implements IUiInitializer {
    private _defaultLocation;
    private _basePath;
    private _rootElement;
    private _urlNavEnabled;
    private _appTitle;
    private _navHandlers;
    private _appReady;
    private _appInitFailed;
    private _appInitializing;
    constructor(defaultLocation: string, basePath: string, rootElement: string, urlNavEnabled: boolean, appTitle: string, appReady: () => void, appInitFailed: () => void, appInitializing: () => void, navHandlers: INavigationHandler[]);
    defaultLocation(): string;
    basePath(): string;
    rootElement(): string;
    urlNavigationEnabled(): boolean;
    appInitializing(): void;
    appReady(): void;
    appInitFailed(): void;
    navigationHandlers(): INavigationHandler[];
    appTitle(): string;
}
