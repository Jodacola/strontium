import IMessageHandler from "./IMessageHandler";
import IMessageInterceptor from "./IMessageInterceptor";
export default class SrLocalMessaging {
    private serviceHandlers;
    private messageInterceptors;
    constructor();
    registerHandler(handler: IMessageHandler): void;
    private registerHandlerForAction(action, handler, handlers);
    removeHandler(handler: IMessageHandler): void;
    private deregisterHandlerForAction(action, handler, handlers);
    setInterceptor(interceptor: IMessageInterceptor): void;
    removeInterceptor(interceptor: IMessageInterceptor): void;
    broadcast(action: string, local?: boolean, data?: any): void;
    private getHandlers();
    private intercepted(msg);
    private broadcastMessage(msg, handlers);
}
