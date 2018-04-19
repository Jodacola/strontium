import { LogLevel } from "../framework/Log";
export default class SrAppConfig {
    constructor() {
        this.loggingLevel = LogLevel.Trace;
        this.logFilter = [];
        this.apiConnections = [];
    }
    setupServices() { }
    ;
    preInitialize() { }
    ;
    postInitialize() { }
    ;
}
//# sourceMappingURL=SrAppConfig.js.map