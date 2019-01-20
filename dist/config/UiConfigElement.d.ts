import { StrontiumAppConfigElement, IConfigElement } from "./StrontiumAppConfigElement";
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
}
export default class UiConfig extends StrontiumAppConfigElement<IUiConfig> {
    static defaultProps: IUiConfig;
    config(): any;
    private uiElementFor;
    private navigationHandlers;
    private createRoute;
}
