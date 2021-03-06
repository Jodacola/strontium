﻿import INavigationHandler from "../navigation/INavigationHandler";
import { FooterElement } from "./UiElements";

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
    viewRenderer(): (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any>;
    internalRenderer(): (element: React.ReactElement<any>) => void;
}
