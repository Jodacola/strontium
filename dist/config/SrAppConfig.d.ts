import { LogLevel } from "../framework/Log";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";
export default abstract class SrAppConfig {
    loggingLevel: LogLevel;
    logFilter: string[];
    staleApiRequestPeriod: number;
    setupServices(): void;
    preInitialize(): void;
    postInitialize(): void;
    abstract errorReporter(): IErrorReporter;
    abstract apiInitializer(): IApiInitializer;
    abstract uiInitializer(): IUiInitializer;
}
