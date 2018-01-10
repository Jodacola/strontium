import Log from "../framework/Log";
import SrAppMessage from "./SrAppMessage";
export default class SrLocalMessaging {
    constructor() {
        this.serviceHandlers = {};
        this.localHandlers = {};
        this.messageInterceptors = {};
        Log.d(this, "Initializing new local messaging system");
    }
    registerHandler(handler) {
        var handlers = this.getHandlers(false);
        var localHandlers = this.getHandlers(true);
        (handler.handles() || []).forEach((action) => {
            this.registerHandlerForAction(action, handler, handlers);
        });
        (handler.handlesLocal() || []).forEach((action) => {
            this.registerHandlerForAction(action, handler, localHandlers);
        });
    }
    ;
    registerHandlerForAction(action, handler, handlers) {
        if (handlers[action] == null) {
            handlers[action] = [];
        }
        if (handlers[action].indexOf(handler) === -1) {
            Log.d(this, "Registering handler for action", { action: action });
            handlers[action].push(handler);
        }
    }
    ;
    removeHandler(handler) {
        var handlers = this.getHandlers(false);
        var localHandlers = this.getHandlers(true);
        (handler.handles() || []).forEach((action) => {
            this.deregisterHandlerForAction(action, handler, handlers);
        });
        (handler.handlesLocal() || []).forEach((action) => {
            this.deregisterHandlerForAction(action, handler, localHandlers);
        });
    }
    deregisterHandlerForAction(action, handler, handlers) {
        if (handlers[action] == null) {
            handlers[action] = [];
        }
        var idx = handlers[action].indexOf(handler);
        if (idx !== -1) {
            handlers[action].splice(idx, 1);
            Log.d(this, "Deregistered handler for action", { action: action });
        }
    }
    ;
    setInterceptor(interceptor) {
        this.messageInterceptors[interceptor.action] = interceptor;
    }
    removeInterceptor(interceptor) {
        if (this.messageInterceptors[interceptor.action]) {
            delete this.messageInterceptors[interceptor.action];
        }
    }
    broadcast(action, data = null, local = false) {
        var msg = new SrAppMessage(action, data, local);
        if (this.intercepted(msg)) {
            return;
        }
        var handlers = this.getHandlers(local);
        this.broadcastMessage(msg, handlers);
    }
    getHandlers(local) {
        return (local ? this.localHandlers : this.serviceHandlers);
    }
    broadcastLocal(action, data = null) {
        this.broadcast(action, data, true);
    }
    intercepted(msg) {
        var intercept = this.messageInterceptors[msg.action];
        if (intercept && intercept.receiveMessage) {
            intercept.receiveMessage(msg);
            return !intercept.passthrough;
        }
        return false;
    }
    broadcastMessage(msg, handlers) {
        (handlers[msg.action] || []).concat(handlers["*"] || []).forEach((h) => {
            h.receiveMessage(msg);
        });
    }
}
//# sourceMappingURL=SrLocalMessaging.js.map