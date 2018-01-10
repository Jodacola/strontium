import Log from "../framework/Log";
import SrAppConfig from "./SrAppConfig";
export default class DefaultAppConfig extends SrAppConfig {
    errorReporter() {
        Log.w(this, "No error reporter defined for default app configuration, which shouldn't be used.");
        return null;
    }
    ;
    apiInitializer() {
        Log.w(this, "No API initializer defined for default app configuration, which shouldn't be used.");
        return null;
    }
    ;
    uiInitializer() {
        Log.w(this, "No UI initializer defined for default app configuration, which shouldn't be used.");
        return null;
    }
    ;
}
//# sourceMappingURL=DefaultAppConfig.js.map