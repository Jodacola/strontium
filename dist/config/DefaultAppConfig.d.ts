import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IUiInitializer from "./IUiInitializer";
export default class DefaultAppConfig extends SrAppConfig {
    errorReporter(): IErrorReporter;
    uiInitializer(): IUiInitializer;
}
