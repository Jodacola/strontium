import { runtime } from "./SrApp";
import CircularJson from "circular-json";

export default class Log {
    public static e(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Error, ctx, msg, data);
    }
    public static w(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Warn, ctx, msg, data);
    }
    public static i(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Info, ctx, msg, data);
    }
    public static d(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Debug, ctx, msg, data);
    }
    public static t(ctx: any, msg: string, data: any = null): void {
        this.log(LogLevel.Trace, ctx, msg, data);
    }
    private static log(level: LogLevel, ctx: any, msg: string, data: any): void {
        var ts: string = `[${new Date().getTime()}]`;
        var context: string = this.getContextName(ctx);
        var message: string = (!msg ? "" : msg);
        var obj: string = (!data ? null : CircularJson.stringify(data));
        var msgData: string[] = !obj ? [context, message] : [context, message, obj];

        if (level >= runtime.config.loggingLevel && !this.isContextFilteredOut(context)) {
            var finalMsg: string = `[${LogLevel[level].toUpperCase()}] ${ts} ${msgData.join(" - ")}`;
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
        if (level === LogLevel.Error) {
            var err: Error = null;
            if (data != null && data.exception != null && data.exception instanceof Error) {
                err = data.exception;
            } else if (data != null && data instanceof Error) {
                err = data;
            } else {
                err = new Error();
            }
            if (runtime.config.errorReporter()) {
                runtime.config.errorReporter().report(`${context} - ${msg}`, err, data || {});
            }
        }
    }

    private static isContextFilteredOut(ctx: string): boolean {
        return ((runtime.config.logFilter || []).indexOf(ctx) !== -1);
    }

    private static getContextName(obj: any): string {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr: string[] = obj.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return "Unknown";
    }
}

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    None
};
