import INavigationHandler from "../navigation/INavigationHandler";

interface IUiInitializer {
    defaultLocation(): string;
    basePath(): string;
    rootElement(): string;
    urlNavigationEnabled(): boolean;
    setupInitialUi(): void;
    setupAppReadyUi(): void;
    navigationHandlers(): INavigationHandler[];
    appTitle(): string;
}

export default IUiInitializer;