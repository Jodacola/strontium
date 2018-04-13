import { LogLevel } from "../framework/Log";
import SrAppConfig from "./SrAppConfig";
import { runtime } from "../lib";
export default class StrontiumAppConfig extends SrAppConfig {
    constructor(options) {
        super();
        options.logConfig = this.defaultLogConfig(options.logConfig);
        this.loggingLevel = this.getLoggingLevel(options.environment, options.logConfig);
        this.logFilter = this.getLogFilters(options.logConfig);
        this._errorReporter = this.errorReporterOrDefault(options.errorReporter);
        this._apiInitializer = options.apiInitializer;
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