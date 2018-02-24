import SrAppConfig from "./SrAppConfig";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";
import ILoggerConfig from "./ILoggerConfig";
export default class StrontiumAppConfig extends SrAppConfig {
    private _errorReporter;
    private _apiInitializer;
    private _uiInitializer;
    private _preInit;
    private _postInit;
    constructor(environment: string, logConfig: ILoggerConfig, errorReporter: IErrorReporter, apiInitializer: IApiInitializer, uiInitializer: IUiInitializer, preInit: () => void, postInit: () => void);
    private defaultLogConfig(config);
    private getLoggingLevel(environment, config);
    private getLogFilters(config);
    private errorReporterOrDefault(reporter);
    errorReporter(): IErrorReporter;
    apiInitializer(): IApiInitializer;
    uiInitializer(): IUiInitializer;
    preInitialize(): void;
    postInitialize(): void;
}
