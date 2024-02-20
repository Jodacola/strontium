import Log from "../framework/Log";
import IApiConnection from "./IApiConnection";
import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import SrStats from "../framework/SrStats";
import CommonMessages from "../messaging/CommonMessages";
import RequestType from "./RequestType";
import IAppMessaging from "../messaging/IAppMessaging";

export default class SrApi {
    private _initialized: boolean = false;
    private _connection?: IApiConnection;
    private _pendingRequests: { [id: string]: SrServiceRequest } = {};
    private _messaging: IAppMessaging;

    constructor(messaging: IAppMessaging) {
        this._messaging = messaging;
    }

    public initialize(conn: IApiConnection): void {
        if (this._initialized || !this.checkConnection(conn)) {
            return;
        }

        this._connection = conn;
        this.attachConnection(conn);
        this.initializeConnection(conn);
    }

    public checkConnection(conn: IApiConnection): boolean {
        if (!conn) {
            Log.w(this, "Invalid API connection supplied.  Cannot initialize API.  Proceeding without API.");
            this._messaging.broadcast(CommonMessages.ApiInitialized, true, { connection: 'default' });
            return false;
        }
        return true;
    }

    public initializeConnection(conn: IApiConnection) {
        conn.initialize((s: boolean) => {
            Log.d(this, "API Initialization callback", { success: s });
            this._initialized = s;
            this._messaging.broadcast(s ? CommonMessages.ApiInitialized : CommonMessages.ApiInitializationFailed, true, { connection: conn.name || 'default' });
        }, false);
    }

    public attachConnection(conn: IApiConnection) {
        conn.onResponse = resp => this.handleResponse(resp);
        conn.onFailedRequest = (req: SrServiceRequest, errors: any[]) => this.handleFailedRequest(req, errors);
        conn.onServerMessage = resp => this.handleDirectMessage(resp);
    }

    public connected(): boolean {
        if (!this._initialized) {
            return false;
        }
        return this._connection?.connected() === true;
    }

    public sendMessage(
        type: RequestType,
        action: string,
        content: any,
        options: any,
        manualCb: (resp: SrServiceResponse) => void): string | undefined {

        if (!this.connected()) {
            Log.e(this, "Attempt to send message against unconnected service", { action: action, content: content });
            return;
        }

        var req: SrServiceRequest = new SrServiceRequest(type, action, content, options, manualCb);
        this.sendRequest(req);
        return req.requestId;
    }

    private sendRequest(req: SrServiceRequest): void {
        if (req.requestId == null) {
            req.requestId = SrStats.start();
        }
        this._pendingRequests[req.requestId] = req;
        this._connection?.sendRequest(req);
    }

    private handleResponse(resp: SrServiceResponse): void {
        Log.d(this, "API Response", { response: resp });
        if (this._pendingRequests[resp.requestId]) {
            var req: SrServiceRequest = this.removeRequest(resp.requestId);
            this.processMessage(req, resp);
        }
    }

    private removeRequest(requestId: string): SrServiceRequest {
        var origReq: SrServiceRequest = this._pendingRequests[requestId];
        delete this._pendingRequests[requestId];
        return origReq;
    }

    private processMessage(req: SrServiceRequest, resp: SrServiceResponse): void {
        SrStats.stop(req.requestId, "API send success", { request: req, response: resp });
        if (!resp.good) {
            Log.w(this, "API result not successful", { request: req, response: resp });
        }
        if (req.callbackHandler != null) {
            req.callbackHandler(resp);
        }
        this._messaging.broadcast(resp.action, false, resp);
    }

    private handleFailedRequest(req: SrServiceRequest, errors: any[]): void {
        SrStats.stop(req.requestId, "API send failure", req);

        this.removeRequest(req.requestId);
        var resp: SrServiceResponse = new SrServiceResponse();
        resp.action = req.action;
        resp.requestId = req.requestId;
        resp.data = null;
        resp.good = false;
        resp.errors = errors;

        Log.e(this, "API send failed", { request: req, response: resp });

        if (req.callbackHandler) {
            req.callbackHandler(resp);
        }
    }

    private handleDirectMessage(resp: SrServiceResponse) {
        this._messaging.broadcast(CommonMessages.RemoteOriginatedMessage, false, resp);
    }
}
