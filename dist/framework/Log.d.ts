export default class Log {
    static error(ctx: any, msg: string, data?: any): void;
    static e(ctx: any, msg: string, data?: any): void;
    static warn(ctx: any, msg: string, data?: any): void;
    static w(ctx: any, msg: string, data?: any): void;
    static info(ctx: any, msg: string, data?: any): void;
    static i(ctx: any, msg: string, data?: any): void;
    static debug(ctx: any, msg: string, data?: any): void;
    static d(ctx: any, msg: string, data?: any): void;
    static trace(ctx: any, msg: string, data?: any): void;
    static t(ctx: any, msg: string, data?: any): void;
}
