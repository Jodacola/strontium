import { runtime } from "./SrApp";
import { stringify } from "circular-json";
import LogLevel from "./LogLevel";
export default class Logger {
    static getLogger() {
        if (!this._logger) {
            if (this.runtimeReady()) {
                this._logger = new Logger(runtime.config.loggingLevel, runtime.config.logFilter, runtime.config.errorReporter());
            }
            else {
                return new Logger(LogLevel.Error);
            }
        }
        return this._logger;
    }
    static runtimeReady() {
        return (!!runtime && !!runtime.config && runtime.config.loggingLevel != null && !!runtime.config.errorReporter);
    }
    constructor(level, logFilter, reporter) {
        this.level = level;
        this.logFilter = logFilter;
        this.reporter = reporter;
    }
    error(ctx, msg, data = null) {
        this.e(ctx, msg, data);
    }
    e(ctx, msg, data = null) {
        this.log(LogLevel.Error, ctx, msg, data);
    }
    warn(ctx, msg, data = null) {
        this.w(ctx, msg, data);
    }
    w(ctx, msg, data = null) {
        this.log(LogLevel.Warn, ctx, msg, data);
    }
    info(ctx, msg, data = null) {
        this.i(ctx, msg, data);
    }
    i(ctx, msg, data = null) {
        this.log(LogLevel.Info, ctx, msg, data);
    }
    debug(ctx, msg, data = null) {
        this.d(ctx, msg, data);
    }
    d(ctx, msg, data = null) {
        this.log(LogLevel.Debug, ctx, msg, data);
    }
    trace(ctx, msg, data = null) {
        this.t(ctx, msg, data);
    }
    t(ctx, msg, data = null) {
        this.log(LogLevel.Trace, ctx, msg, data);
    }
    log(level, ctx, msg, data) {
        var context = this.getContextName(ctx);
        if (this.shouldLog(level, context)) {
            this.logMessage(level, data, context, msg);
        }
        if (level === LogLevel.Error) {
            this.reportError(context, msg, data);
        }
    }
    logMessage(level, data, context, msg) {
        var finalMsg = this.buildMessage(new Date().getTime(), level, data, context, msg);
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
    buildMessage(time, level, data, context, msg) {
        var ts = `[${time}]`;
        var obj = (!data ? null : stringify(data));
        var msgData = [context, msg, obj];
        return [`[${LogLevel[level].toUpperCase()}]`, ts, msgData.filter(m => !!m).join(" - ")].filter(m => !!m).join(' ');
    }
    reportError(context, msg, data) {
        if (!this.reporter) {
            return;
        }
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
        this.reporter.report([context, msg].filter(m => !!m).join(' - '), err, data || {});
    }
    shouldLog(level, context) {
        return (level !== LogLevel.None && level >= this.level && !this.isContextFilteredOut(context));
    }
    isContextFilteredOut(ctx) {
        return ((this.logFilter || []).indexOf(ctx) !== -1);
    }
    getContextName(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            const classConstructor = obj.constructor.toString().match(/^(class|function)\s*(\w+)/);
            if (classConstructor && classConstructor.length >= 3) {
                return classConstructor[2];
            }
        }
        return "Unknown";
    }
}
//# sourceMappingURL=Logger.js.map