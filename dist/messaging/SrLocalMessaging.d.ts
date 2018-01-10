import IMessageHandler from "./IMessageHandler";
import IMessageInterceptor from "./IMessageInterceptor";
export default class SrLocalMessaging {
    private serviceHandlers;
    private localHandlers;
    private messageInterceptors;
    constructor();
    registerHandler(handler: IMessageHandler): void;
    private registerHandlerForAction(action, handler, handlers);
    removeHandler(handler: IMessageHandler): void;
    private deregisterHandlerForAction(action, handler, handlers);
    setInterceptor(interceptor: IMessageInterceptor): void;
    removeInterceptor(interceptor: IMessageInterceptor): void;
    broadcast(action: string, data?: any, local?: boolean): void;
    private getHandlers(local);
    broadcastLocal(action: string, data?: any): void;
    private intercepted(msg);
    private broadcastMessage(msg, handlers);
}
