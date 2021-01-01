import { runtime } from "./SrApp";
import { stringify } from "circular-json";
import LogLevel from "./LogLevel";
import IErrorReporter from "../config/IErrorReporter";

export default class Logger {
    private static _logger: Logger;

    public static getLogger(): Logger {
        if (!this._logger) {
            if (this.runtimeReady()) {
                this._logger = new Logger(runtime.config.loggingLevel, runtime.config.logFilter, runtime.config.errorReporter());
            } else {
                return new Logger(LogLevel.Error);
            }
        }

        return this._logger;
    }

    private static runtimeReady(): boolean {
        return (!!runtime && !!runtime.config && runtime.config.loggingLevel != null && !!runtime.config.errorReporter);
    }

    constructor(public level: LogLevel, public logFilter?: string[], public reporter?: IErrorReporter) {
    }

    public error(ctx: any, msg: string, data: any = null): void {
        this.e(ctx, msg, data);
    }

    public e(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Error, ctx, msg, data);
    }

    public warn(ctx: any, msg: string, data: any = null): void {
        this.w(ctx, msg, data);
    }

    public w(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Warn, ctx, msg, data);
    }

    public info(ctx: any, msg: string, data: any = null): void {
        this.i(ctx, msg, data);
    }

    public i(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Info, ctx, msg, data);
    }

    public debug(ctx: any, msg: string, data: any = null): void {
        this.d(ctx, msg, data);
    }

    public d(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Debug, ctx, msg, data);
    }

    public trace(ctx: any, msg: string, data: any = null): void {
        this.t(ctx, msg, data);
    }

    public t(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Trace, ctx, msg, data);
    }

    public log(level: LogLevel, ctx: any, msg: string, data: any): void {
        var context: string = this.getContextName(ctx);

        if (this.shouldLog(level, context)) {
            this.logMessage(level, data, context, msg);
        }

        if (level === LogLevel.Error) {
            this.reportError(context, msg, data);
        }
    }

    private logMessage(level: LogLevel, data: any, context: string, msg: string) {
        var finalMsg: string = this.buildMessage(new Date().getTime(), level, data, context, msg);
        if (level === LogLevel.Error) {
            console.error(finalMsg);
        } else if (level === LogLevel.Warn) {
            console.warn(finalMsg);
        } else if (level === LogLevel.Debug) {
            console.log(`%c${finalMsg}`, "color:#88c");
        } else if (level === LogLevel.Trace) {
            console.log(`%c${finalMsg}`, "color:#aaa");
        } else {
            console.log(finalMsg);
        }
    }

    private buildMessage(time: number, level: LogLevel, data: any, context: string, msg: string) {
        var ts: string = `[${time}]`;
        var obj: string = (!data ? null : stringify(data));
        var msgData: string[] = [context, msg, obj];
        return [`[${LogLevel[level].toUpperCase()}]`, ts, msgData.filter(m => !!m).join(" - ")].filter(m => !!m).join(' ');
    }

    private reportError(context: string, msg: string, data: any) {
        if (!this.reporter) {
            return;
        }

        var err: Error = null;
        if (data != null && data.exception != null && data.exception instanceof Error) {
            err = data.exception;
        } else if (data != null && data instanceof Error) {
            err = data;
        } else {
            err = new Error();
        }

        this.reporter.report([context, msg].filter(m => !!m).join(' - '), err, data || {});
    }

    private shouldLog(level: LogLevel, context: string) {
        return (level !== LogLevel.None && level >= this.level && !this.isContextFilteredOut(context));
    }

    private isContextFilteredOut(ctx: string): boolean {
        return ((this.logFilter || []).indexOf(ctx) !== -1);
    }

    private getContextName(obj: any): string {
        if (obj && obj.constructor && obj.constructor.toString) {
            const classConstructor: string[] = obj.constructor.toString().match(/^(class|function)\s*(\w+)/);
            if (classConstructor && classConstructor.length >= 3) {
                return classConstructor[2];
            }
        }

        return "Unknown";
    }
}
