import Log from "../framework/Log";
import IMessageHandler from "./IMessageHandler";
import SrAppMessage from "./SrAppMessage";
import IMessageInterceptor from "./IMessageInterceptor";

export default class SrLocalMessaging {
    private serviceHandlers: IHandlerMap = {};
    private localHandlers: IHandlerMap = {};
    private messageInterceptors: IInterceptorMap = {};

    constructor() {
        Log.d(this, "Initializing new local messaging system");
    }

    public registerHandler(handler: IMessageHandler): void {
        var handlers: IHandlerMap = this.getHandlers(false);
        var localHandlers: IHandlerMap = this.getHandlers(true);
        (handler.handles() || []).forEach((action: string) => {
            this.registerHandlerForAction(action, handler, handlers);
        });
        (handler.handlesLocal() || []).forEach((action: string) => {
            this.registerHandlerForAction(action, handler, localHandlers);
        });
    };

    private registerHandlerForAction(action: string, handler: IMessageHandler, handlers: IHandlerMap): void {
        if (handlers[action] == null) {
            handlers[action] = [];
        }

        if (handlers[action].indexOf(handler) === -1) {
            Log.d(this, "Registering handler for action", { action: action });
            handlers[action].push(handler);
        }
    };

    public removeHandler(handler: IMessageHandler): void {
        var handlers: IHandlerMap = this.getHandlers(false);
        var localHandlers: IHandlerMap = this.getHandlers(true);
        (handler.handles() || []).forEach((action: string) => {
            this.deregisterHandlerForAction(action, handler, handlers);
        });
        (handler.handlesLocal() || []).forEach((action: string) => {
            this.deregisterHandlerForAction(action, handler, localHandlers);
        });
    }

    private deregisterHandlerForAction(action: string, handler: IMessageHandler, handlers: IHandlerMap): void {
        if (handlers[action] == null) {
            handlers[action] = [];
        }

        var idx: number = handlers[action].indexOf(handler);
        if (idx !== -1) {
            handlers[action].splice(idx, 1);
            Log.d(this, "Deregistered handler for action", { action: action });
        }
    };

    public setInterceptor(interceptor: IMessageInterceptor): void {
        this.messageInterceptors[interceptor.action] = interceptor;
    }

    public removeInterceptor(interceptor: IMessageInterceptor): void {
        if (this.messageInterceptors[interceptor.action]) {
            delete this.messageInterceptors[interceptor.action];
        }
    }

    public broadcast(action: string, data: any = null, local: boolean = false): void {
        var msg: SrAppMessage = new SrAppMessage(action, data, local);
        if (this.intercepted(msg)) {
            return;
        }
        var handlers: IHandlerMap = this.getHandlers(local);
        this.broadcastMessage(msg, handlers);
    }

    private getHandlers(local: boolean): IHandlerMap {
        return (local ? this.localHandlers : this.serviceHandlers);
    }

    public broadcastLocal(action: string, data: any = null): void {
        this.broadcast(action, data, true);
    }

    private intercepted(msg: SrAppMessage): boolean {
        var intercept: IMessageInterceptor = this.messageInterceptors[msg.action];
        if (intercept && intercept.receiveMessage) {
            intercept.receiveMessage(msg);
            return !intercept.passthrough;
        }
        return false;
    }

    private broadcastMessage(msg: SrAppMessage, handlers: IHandlerMap): void {
        (handlers[msg.action] || []).concat(handlers["*"] || []).forEach((h: IMessageHandler) => {
            h.receiveMessage(msg);
        });
    }
}

interface IHandlerMap {
    [action: string]: IMessageHandler[];
}

interface IInterceptorMap {
    [action: string]: IMessageInterceptor;
}
