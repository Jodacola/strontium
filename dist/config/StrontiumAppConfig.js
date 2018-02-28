import { LogLevel } from "../framework/Log";
import SrAppConfig from "./SrAppConfig";
import { runtime } from "../lib";
export default class StrontiumAppConfig extends SrAppConfig {
    constructor(environment, logConfig, errorReporter, apiInitializer, uiInitializer, services, preInit, postInit) {
        super();
        logConfig = this.defaultLogConfig(logConfig);
        this.loggingLevel = this.getLoggingLevel(environment, logConfig);
        this.logFilter = this.getLogFilters(logConfig);
        this._errorReporter = this.errorReporterOrDefault(errorReporter);
        this._apiInitializer = apiInitializer;
        this._uiInitializer = uiInitializer;
        this._services = services;
        this._preInit = preInit;
        this._postInit = postInit;
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
        return reporter || {
            report: (message, error, data) => {
                console.error(`Strontium error: ${message}`);
                console.error(Error);
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
    apiInitializer() {
        return this._apiInitializer;
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