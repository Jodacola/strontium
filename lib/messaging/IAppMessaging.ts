import IMessageHandler from "./IMessageHandler";
import IMessageInterceptor from "./IMessageInterceptor";

export default interface IAppMessaging {
    registerHandler(handler: IMessageHandler): void;
    removeHandler(handler: IMessageHandler): void;
    setInterceptor(interceptor: IMessageInterceptor): void;
    removeInterceptor(interceptor: IMessageInterceptor): void;
    broadcast(action: string, local: boolean, data: any): void;
}