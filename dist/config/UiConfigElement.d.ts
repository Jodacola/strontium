import StrontiumAppConfigElement, { IConfigElement } from "./StrontiumAppConfigElement";
import * as React from "react";
export interface IUiConfig extends IConfigElement {
    defaultLocation?: string;
    basePath?: string;
    rootElement?: string;
    urlNavigationEnabled?: boolean;
    navigateOnQueryChanges?: boolean;
    appTitle?: string;
    appReady?: () => void;
    appInitFailed?: () => void;
    appInitializing?: () => void;
    viewRenderer?: (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any>;
    internalRenderer?: (element: React.ReactElement<any>) => void;
}
export default class UiConfig extends StrontiumAppConfigElement<IUiConfig> {
    static defaultProps: IUiConfig;
    config(): any;
    private uiElementFor;
    private navigationHandlers;
    private createRoute;
}
