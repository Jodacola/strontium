import IErrorReporter from "./IErrorReporter";
import IUiInitializer from "./IUiInitializer";
import { IApiConnection } from "../lib";
import LogLevel from "../framework/LogLevel";
export default abstract class SrAppConfig {
    loggingLevel: LogLevel;
    logFilter: string[];
    apiConnections: IApiConnection[];
    setupServices(): void;
    preInitialize(): void;
    postInitialize(): void;
    abstract errorReporter(): IErrorReporter;
    abstract uiInitializer(): IUiInitializer;
}
