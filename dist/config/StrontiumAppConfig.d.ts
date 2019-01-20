import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IUiInitializer from "./IUiInitializer";
import ILoggerConfig from "./ILoggerConfig";
import IAppService from "../framework/IAppService";
import { IApiConnection } from "../lib";
export default class StrontiumAppConfig extends SrAppConfig {
    private _errorReporter;
    private _uiInitializer;
    private _preInit;
    private _postInit;
    private _services;
    constructor(options: {
        environment: string;
        logConfig: ILoggerConfig;
        errorReporter: IErrorReporter;
        apiConnections: IApiConnection[];
        uiInitializer: IUiInitializer;
        services: IAppService[];
        preInit: () => void;
        postInit: () => void;
    });
    private defaultLogConfig;
    private getLoggingLevel;
    private getLogFilters;
    private errorReporterOrDefault;
    errorReporter(): IErrorReporter;
    uiInitializer(): IUiInitializer;
    preInitialize(): void;
    setupServices(): void;
    postInitialize(): void;
}
