import Log, { LogLevel } from "../framework/Log";
import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";
import ILoggerConfig from "./ILoggerConfig";
import IAppService from "../framework/IAppService";
import { runtime } from "../lib";

export default class StrontiumAppConfig extends SrAppConfig {
    private _errorReporter: IErrorReporter;
    private _apiInitializer: IApiInitializer;
    private _uiInitializer: IUiInitializer;
    private _preInit: () => void;
    private _postInit: () => void;
    private _services: IAppService[];

    constructor(
        environment: string,
        logConfig: ILoggerConfig,
        errorReporter: IErrorReporter,
        apiInitializer: IApiInitializer,
        uiInitializer: IUiInitializer,
        services: IAppService[],
        preInit: () => void,
        postInit: () => void) {
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

    private defaultLogConfig(config: ILoggerConfig): ILoggerConfig {
        return config || { loggingLevel: null, logExclusions: null };
    }

    private getLoggingLevel(environment: string, config: ILoggerConfig): LogLevel {
        return typeof config.loggingLevel === 'undefined' ? (environment !== 'production' ? LogLevel.Debug : LogLevel.None) : config.loggingLevel;
    }

    private getLogFilters(config: ILoggerConfig): string[] {
        return config.logExclusions || [];
    }

    private errorReporterOrDefault(reporter: IErrorReporter): IErrorReporter {
        return reporter || {
            report: (message: string, error: Error, data: any): void => {
                console.error(`Strontium error: ${message}`);
                console.error(Error);
                if (data) {
                    console.error(data);
                }
            }
        };
    }

    public errorReporter(): IErrorReporter {
        return this._errorReporter;
    };
    public apiInitializer(): IApiInitializer {
        return this._apiInitializer;
    };
    public uiInitializer(): IUiInitializer {
        return this._uiInitializer;
    };

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