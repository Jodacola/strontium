/// <reference types="react" />
import INavigationHandler from "../navigation/INavigationHandler";
export default interface IUiInitializer {
    defaultLocation(): string;
    basePath(): string;
    rootElement(): string;
    urlNavigationEnabled(): boolean;
    navigateOnQueryChange(): boolean;
    appInitializing(): void;
    appReady(): void;
    appInitFailed(): void;
    navigationHandlers(): INavigationHandler[];
    appTitle(): string;
    footerElement(): React.ReactNode | React.ReactNode[];
    headerElement(): React.ReactNode | React.ReactNode[];
    containerElement(): React.ReactNode;
}
