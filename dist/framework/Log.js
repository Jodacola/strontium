import { runtime } from "./SrApp";
import CircularJson from "circular-json";
export default class Log {
    static e(ctx, msg, data = null) {
        this.log(LogLevel.Error, ctx, msg, data);
    }
    static w(ctx, msg, data = null) {
        this.log(LogLevel.Warn, ctx, msg, data);
    }
    static i(ctx, msg, data = null) {
        this.log(LogLevel.Info, ctx, msg, data);
    }
    static d(ctx, msg, data = null) {
        this.log(LogLevel.Debug, ctx, msg, data);
    }
    static t(ctx, msg, data = null) {
        this.log(LogLevel.Trace, ctx, msg, data);
    }
    static log(level, ctx, msg, data) {
        var ts = `[${new Date().getTime()}]`;
        var context = this.getContextName(ctx);
        var message = (!msg ? "" : msg);
        var obj = (!data ? null : CircularJson.stringify(data));
        var msgData = !obj ? [context, message] : [context, message, obj];
        if (level >= runtime.config.loggingLevel && !this.isContextFilteredOut(context)) {
            var finalMsg = `[${LogLevel[level].toUpperCase()}] ${ts} ${msgData.join(" - ")}`;
            if (level === LogLevel.Error) {
                console.error(finalMsg);
            }
            else if (level === LogLevel.Warn) {
                console.warn(finalMsg);
            }
            else if (level === LogLevel.Debug) {
                console.log(`%c${finalMsg}`, "color:#88c");
            }
            else if (level === LogLevel.Trace) {
                console.log(`%c${finalMsg}`, "color:#aaa");
            }
            else {
                console.log(finalMsg);
            }
        }
        if (level === LogLevel.Error) {
            var err = null;
            if (data != null && data.exception != null && data.exception instanceof Error) {
                err = data.exception;
            }
            else if (data != null && data instanceof Error) {
                err = data;
            }
            else {
                err = new Error();
            }
            if (runtime.config.errorReporter()) {
                runtime.config.errorReporter().report(`${context} - ${msg}`, err, data || {});
            }
        }
    }
    static isContextFilteredOut(ctx) {
        return ((runtime.config.logFilter || []).indexOf(ctx) !== -1);
    }
    static getContextName(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);
            if (arr && arr.length === 2) {
                return arr[1];
            }
        }
        return "Unknown";
    }
}
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["None"] = 5] = "None";
})(LogLevel || (LogLevel = {}));
;
//# sourceMappingURL=Log.js.map