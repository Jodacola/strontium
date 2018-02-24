import { LogLevel } from "../framework/Log";
export default class SrAppConfig {
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
//# sourceMappingURL=SrAppConfig.js.map