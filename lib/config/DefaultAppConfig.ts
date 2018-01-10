import Log from "../framework/Log";
import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";

export default class DefaultAppConfig extends SrAppConfig {
    public errorReporter(): IErrorReporter {
        Log.w(this, "No error reporter defined for default app configuration, which shouldn't be used.");
        return null;
    };
    public apiInitializer(): IApiInitializer {
        Log.w(this, "No API initializer defined for default app configuration, which shouldn't be used.");
        return null;
    };
    public uiInitializer(): IUiInitializer {
        Log.w(this, "No UI initializer defined for default app configuration, which shouldn't be used.");
        return null;
    };
}