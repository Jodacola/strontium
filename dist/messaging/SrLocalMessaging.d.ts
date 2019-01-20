import IMessageHandler from "./IMessageHandler";
import IMessageInterceptor from "./IMessageInterceptor";
import IAppMessaging from "./IAppMessaging";
export default class SrLocalMessaging implements IAppMessaging {
    private serviceHandlers;
    private messageInterceptors;
    constructor();
    registerHandler(handler: IMessageHandler): void;
    private registerHandlerForAction;
    removeHandler(handler: IMessageHandler): void;
    private deregisterHandlerForAction;
    setInterceptor(interceptor: IMessageInterceptor): void;
    removeInterceptor(interceptor: IMessageInterceptor): void;
    broadcast(action: string, local?: boolean, data?: any): void;
    private getHandlers;
    private intercepted;
    private broadcastMessage;
}
