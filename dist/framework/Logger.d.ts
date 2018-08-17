import { IErrorReporter } from "../config/Config";
import LogLevel from "./LogLevel";
export default class Logger {
    level: LogLevel;
    logFilter: string[];
    reporter: IErrorReporter;
    private static _logger;
    static getLogger(): Logger;
    private static runtimeReady();
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
    private logMessage(level, data, context, msg);
    private buildMessage(time, level, data, context, msg);
    private reportError(context, msg, data);
    private shouldLog(level, context);
    private isContextFilteredOut(ctx);
    private getContextName(obj);
}
