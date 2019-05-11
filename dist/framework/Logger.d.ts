import LogLevel from "./LogLevel";
import IErrorReporter from "../config/IErrorReporter";
export default class Logger {
    level: LogLevel;
    logFilter?: string[];
    reporter?: IErrorReporter;
    private static _logger;
    static getLogger(): Logger;
    private static runtimeReady;
    constructor(level: LogLevel, logFilter?: string[], reporter?: IErrorReporter);
    error(ctx: any, msg: string, data?: any): void;
    e(ctx: any, msg: string, data?: any): void;
    warn(ctx: any, msg: string, data?: any): void;
    w(ctx: any, msg: string, data?: any): void;
    info(ctx: any, msg: string, data?: any): void;
    i(ctx: any, msg: string, data?: any): void;
    debug(ctx: any, msg: string, data?: any): void;
    d(ctx: any, msg: string, data?: any): void;
    trace(ctx: any, msg: string, data?: any): void;
    t(ctx: any, msg: string, data?: any): void;
    log(level: LogLevel, ctx: any, msg: string, data: any): void;
    private logMessage;
    private buildMessage;
    private reportError;
    private shouldLog;
    private isContextFilteredOut;
    private getContextName;
}
