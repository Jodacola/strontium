import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";
export default class DefaultAppConfig extends SrAppConfig {
    errorReporter(): IErrorReporter;
    apiInitializer(): IApiInitializer;
    uiInitializer(): IUiInitializer;
}
