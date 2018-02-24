import INavigationHandler from "../navigation/INavigationHandler";

export default interface IUiInitializer {
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
