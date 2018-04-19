import Log from "../framework/Log";
import { CommonMessages } from "../lib";
import uuid from "uuid";
export default class ApiContainer {
    constructor(messaging) {
        this._apiMap = {};
        this.serviceId = 'apiContainer-' + uuid.v4();
        this._messaging = messaging;
    }
    get(name) {
        Log.t(this, 'Api requested', { name });
        if (!this._apiMap[name]) {
            Log.w(this, 'The request api is not registered.', { name });
        }
        return this._apiMap[name].api;
    }
    register(name, api, connection) {
        Log.t(this, 'Api registered', { name });
        if (!name) {
            Log.w(this, 'Cannot register an api with no name');
            return;
        }
        if (this._apiMap[name]) {
            Log.w(this, 'This api registration is overwriting a previous registration.', { name });
        }
        this._apiMap[name] = { api, connection };
    }
    initialize() {
    }
    handles() {
        return [CommonMessages.ApiInitialized, CommonMessages.ApiInitializationFailed];
    }
    receiveMessage(msg) {
        if (msg.data) {
            this._apiMap[msg.data.connection].initializationResult = (msg.action === CommonMessages.ApiInitialized ? 'succeeded' : 'failed');
            this.finalizeIfAllResponded();
        }
    }
    finalizeIfAllResponded() {
        let remaining = Object.keys(this._apiMap).filter(k => !this._apiMap[k].initializationResult).length;
        if (remaining === 0) {
            let failed = Object.keys(this._apiMap).filter(k => this._apiMap[k].initializationResult === 'failed').length;
            this._messaging.broadcast((failed > 0 ? CommonMessages.ApiInitializationFailed : CommonMessages.ApiInitialized), true, undefined);
        }
    }
    initializeApis() {
        if (Object.keys(this._apiMap).length === 0) {
            this._messaging.broadcast(CommonMessages.ApiInitialized, true, undefined);
            return;
        }
        Object.keys(this._apiMap).forEach(k => {
            let apiDef = this._apiMap[k];
            apiDef.api.initialize(apiDef.connection);
        });
    }
}
//# sourceMappingURL=ApiContainer.js.map