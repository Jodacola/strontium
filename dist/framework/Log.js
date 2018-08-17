import Logger from "./Logger";
export default class Log {
    static error(ctx, msg, data = null) {
        Logger.getLogger().e(ctx, msg, data);
    }
    static e(ctx, msg, data = null) {
        Logger.getLogger().e(ctx, msg, data);
    }
    static warn(ctx, msg, data = null) {
        Logger.getLogger().w(ctx, msg, data);
    }
    static w(ctx, msg, data = null) {
        Logger.getLogger().w(ctx, msg, data);
    }
    static info(ctx, msg, data = null) {
        Logger.getLogger().i(ctx, msg, data);
    }
    static i(ctx, msg, data = null) {
        Logger.getLogger().i(ctx, msg, data);
    }
    static debug(ctx, msg, data = null) {
        Logger.getLogger().d(ctx, msg, data);
    }
    static d(ctx, msg, data = null) {
        Logger.getLogger().d(ctx, msg, data);
    }
    static trace(ctx, msg, data = null) {
        Logger.getLogger().t(ctx, msg, data);
    }
    static t(ctx, msg, data = null) {
        Logger.getLogger().t(ctx, msg, data);
    }
}
//# sourceMappingURL=Log.js.map