import { LogLevel } from "../framework/Log";
import IErrorReporter from "./IErrorReporter";
import IApiInitializer from "./IApiInitializer";
import IUiInitializer from "./IUiInitializer";

export default abstract class SrAppConfig {
    public loggingLevel: LogLevel = LogLevel.Trace;
    public logFilter: string[] = [];
    public staleApiRequestPeriod: number = 60000;

    public setupServices(): void {};
    public preInitialize(): void {};
    public postInitialize(): void {};

    public abstract errorReporter(): IErrorReporter;
    public abstract apiInitializer(): IApiInitializer;
    public abstract uiInitializer(): IUiInitializer;
}
