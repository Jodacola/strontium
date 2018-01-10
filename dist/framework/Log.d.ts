export default class Log {
    static e(ctx: any, msg: string, data?: any): void;
    static w(ctx: any, msg: string, data?: any): void;
    static i(ctx: any, msg: string, data?: any): void;
    static d(ctx: any, msg: string, data?: any): void;
    static t(ctx: any, msg: string, data?: any): void;
    private static log(level, ctx, msg, data);
    private static isContextFilteredOut(ctx);
    private static getContextName(obj);
}
export declare enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    None = 5,
}
