import IErrorReporter from "./IErrorReporter";
import IUiInitializer from "./IUiInitializer";
import { IApiConnection } from "../lib";
import LogLevel from "../framework/LogLevel";

export default abstract class SrAppConfig {
    public loggingLevel: LogLevel = LogLevel.Trace;
    public logFilter: string[] = [];
    public apiConnections: IApiConnection[] = [];

    public setupServices(): void { };
    public preInitialize(): void { };
    public postInitialize(): void { };

    public abstract errorReporter(): IErrorReporter;
    public abstract uiInitializer(): IUiInitializer;
}
