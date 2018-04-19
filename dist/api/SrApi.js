import Log from "../framework/Log";
import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import SrStats from "../framework/SrStats";
import CommonMessages from "../messaging/CommonMessages";
export default class SrApi {
    constructor(messaging) {
        this._initialized = false;
        this._connection = null;
        this._pendingRequests = {};
        this._messaging = messaging;
    }
    initialize(conn) {
        if (this._initialized || !this.checkConnection(conn)) {
            return;
        }
        this._connection = conn;
        this.attachConnection(conn);
        this.initializeConnection(conn);
    }
    checkConnection(conn) {
        if (!conn) {
            Log.w(this, "Invalid API connection supplied.  Cannot initialize API.  Proceeding without API.");
            this._messaging.broadcast(CommonMessages.ApiInitialized, true, { connection: conn.name || 'default' });
            return false;
        }
        return true;
    }
    initializeConnection(conn) {
        conn.initialize((s) => {
            Log.d(this, "API Initialization callback", { success: s });
            this._initialized = s;
            this._messaging.broadcast(s ? CommonMessages.ApiInitialized : CommonMessages.ApiInitializationFailed, true, { connection: conn.name || 'default' });
        }, false);
    }
    attachConnection(conn) {
        conn.onResponse = resp => this.handleResponse(resp);
        conn.onFailedRequest = (req, errors) => this.handleFailedRequest(req, errors);
        conn.onServerMessage = resp => this.handleDirectMessage(resp);
    }
    connected() {
        if (!this._initialized) {
            return false;
        }
        return this._connection.connected();
    }
    sendMessage(type, action, content, options, manualCb = null) {
        if (!this.connected()) {
            Log.e(this, "Attempt to send message against unconnected service", { action: action, content: content });
            return;
        }
        var req = new SrServiceRequest(type, action, content, options, manualCb);
        this.sendRequest(req);
        return req.requestId;
    }
    sendRequest(req) {
        if (req.requestId == null) {
            req.requestId = SrStats.start();
        }
        this._pendingRequests[req.requestId] = req;
        this._connection.sendRequest(req);
    }
    handleResponse(resp) {
        Log.d(this, "API Response", { response: resp });
        if (this._pendingRequests[resp.requestId]) {
            var req = this.removeRequest(resp.requestId);
            this.processMessage(req, resp);
        }
    }
    removeRequest(requestId) {
        var origReq = this._pendingRequests[requestId];
        delete this._pendingRequests[requestId];
        return origReq;
    }
    processMessage(req, resp) {
        SrStats.stop(req.requestId, "API send success", { request: req, response: resp });
        if (!resp.good) {
            Log.w(this, "API result not successful", { request: req, response: resp });
        }
        if (req.callbackHandler != null) {
            req.callbackHandler(resp);
        }
        this._messaging.broadcast(resp.action, false, resp);
    }
    handleFailedRequest(req, errors) {
        SrStats.stop(req.requestId, "API send failure", req);
        this.removeRequest(req.requestId);
        var resp = new SrServiceResponse();
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
    handleDirectMessage(resp) {
        this._messaging.broadcast(CommonMessages.RemoteOriginatedMessage, false, resp);
    }
}
//# sourceMappingURL=SrApi.js.map