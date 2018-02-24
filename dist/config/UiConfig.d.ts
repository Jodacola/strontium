import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
export interface IUiConfig {
    defaultLocation?: string;
    basePath?: string;
    rootElement?: string;
    urlNavigationEnabled?: boolean;
    appTitle?: string;
}
export default class UiConfig extends StrontiumAppConfigElement<IUiConfig> {
    elementType(): ConfigElementTypes;
    config(): any;
}
