import SrAppConfig from "./SrAppConfig";
import { runtime } from "../lib";
import LogLevel from "../framework/LogLevel";
export default class StrontiumAppConfig extends SrAppConfig {
    constructor(options) {
        super();
        options.logConfig = this.defaultLogConfig(options.logConfig);
        this.loggingLevel = this.getLoggingLevel(options.environment, options.logConfig);
        this.logFilter = this.getLogFilters(options.logConfig);
        this._errorReporter = this.errorReporterOrDefault(options.errorReporter);
        this.apiConnections = options.apiConnections;
        this._uiInitializer = options.uiInitializer;
        this._services = options.services;
        this._preInit = options.preInit;
        this._postInit = options.postInit;
    }
    defaultLogConfig(config) {
        return config || { loggingLevel: null, logExclusions: null };
    }
    getLoggingLevel(environment, config) {
        return typeof config.loggingLevel === 'undefined' ? (environment !== 'production' ? LogLevel.Debug : LogLevel.None) : config.loggingLevel;
    }
    getLogFilters(config) {
        return config.logExclusions || [];
    }
    errorReporterOrDefault(reporter) {
        return reporter !== null && reporter !== void 0 ? reporter : {
            report: (message, error, data) => {
                console.error(`Strontium error: ${message}`);
                console.error(error);
                if (data) {
                    console.error(data);
                }
            }
        };
    }
    errorReporter() {
        return this._errorReporter;
    }
    ;
    uiInitializer() {
        return this._uiInitializer;
    }
    ;
    preInitialize() {
        if (this._preInit) {
            this._preInit();
        }
    }
    setupServices() {
        (this._services || []).forEach((svc) => {
            runtime.services.register(svc);
        });
    }
    postInitialize() {
        if (this._postInit) {
            this._postInit();
        }
    }
}
//# sourceMappingURL=StrontiumAppConfig.js.map