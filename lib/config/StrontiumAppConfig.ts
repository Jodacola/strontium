import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IUiInitializer from "./IUiInitializer";
import ILoggerConfig from "./ILoggerConfig";
import IAppService from "../framework/IAppService";
import { runtime, IApiConnection } from "../lib";
import LogLevel from "../framework/LogLevel";

export default class StrontiumAppConfig extends SrAppConfig {
    private _errorReporter: IErrorReporter;
    private _uiInitializer: IUiInitializer;
    private _preInit: () => void;
    private _postInit: () => void;
    private _services: IAppService[];

    constructor(options: {
        environment: string,
        logConfig: ILoggerConfig,
        errorReporter: IErrorReporter,
        apiConnections: IApiConnection[],
        uiInitializer: IUiInitializer,
        services: IAppService[],
        preInit: () => void,
        postInit: () => void
    }) {
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