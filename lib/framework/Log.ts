import Logger from "./Logger";

export default class Log {
    public static error(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().e(ctx, msg, data);
    }

    public static e(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().e(ctx, msg, data);
    }

    public static warn(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().w(ctx, msg, data);
    }

    public static w(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().w(ctx, msg, data);
    }

    public static info(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().i(ctx, msg, data);
    }

    public static i(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().i(ctx, msg, data);
    }

    public static debug(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().d(ctx, msg, data);
    }

    public static d(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().d(ctx, msg, data);
    }

    public static trace(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().t(ctx, msg, data);
    }

    public static t(ctx: any, msg: string, data: any = null): void {
        Logger.getLogger().t(ctx, msg, data);
    }
}
