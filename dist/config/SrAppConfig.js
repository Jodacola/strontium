import { LogLevel } from "../framework/Log";
class SrAppConfig {
    constructor() {
        this.loggingLevel = LogLevel.Trace;
        this.logFilter = [];
        this.staleApiRequestPeriod = 60000;
    }
    preInitialize() { }
    ;
    postInitialize() { }
    ;
}
export default SrAppConfig;
//# sourceMappingURL=SrAppConfig.js.map