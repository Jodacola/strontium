import { LogLevel } from "../framework/Log";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";
declare abstract class SrAppConfig {
    loggingLevel: LogLevel;
    logFilter: string[];
    staleApiRequestPeriod: number;
    preInitialize(): void;
    postInitialize(): void;
    abstract errorReporter(): IErrorReporter;
    abstract apiInitializer(): IApiInitializer;
    abstract uiInitializer(): IUiInitializer;
}
export default SrAppConfig;
