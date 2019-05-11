import SrApi from "./SrApi";
import Log from "../framework/Log";
import { IAppService, CommonMessages, SrAppMessage, IApiConnection } from "../lib";
import IAppMessaging from "../messaging/IAppMessaging";
import * as uuid from "uuid";

interface IApiContainerItem {
    api: SrApi,
    connection: IApiConnection,
    initializationResult?: undefined | 'succeeded' | 'failed'
}

export default class ApiContainer implements IAppService {
    private _apiMap: { [name: string]: IApiContainerItem } = {};
    private _messaging: IAppMessaging;
    public serviceId = 'apiContainer-' + uuid.v4();

    constructor(messaging: IAppMessaging) {
        this._messaging = messaging;
    }

    get(name: string): SrApi {
        Log.t(this, 'Api requested', { name });
        if (!this._apiMap[name]) {
            Log.w(this, 'The request api is not registered.', { name });
        }
        return this._apiMap[name].api;
    }

    register(name: string, api: SrApi, connection: IApiConnection): void {
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

    handles(): string[] {
        return [CommonMessages.ApiInitialized, CommonMessages.ApiInitializationFailed];
    }

    receiveMessage(msg: SrAppMessage) {
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