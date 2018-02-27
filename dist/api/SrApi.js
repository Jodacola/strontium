import Log from "../framework/Log";
import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import SrStats from "../framework/SrStats";
import { runtime } from "../framework/SrApp";
import CommonMessages from "../messaging/CommonMessages";
export default class SrApi {
    constructor() {
        this.initialized = false;
        this.connection = null;
        this.pendingRequests = {};
    }
    initialize(initializer) {
        if (this.initialized) {
            return;
        }
        if (initializer == null) {
            Log.w(this, "Invalid API initializer supplied.  Cannot initialize API.  Proceeding without API.");
            runtime.messaging.broadcast(CommonMessages.ApiInitialized);
            return;
        }
        this.connection = initializer.buildConnection();
        this.connection.responseHandler = (resp) => {
            this.handleResponse(resp);
        };
        this.connection.failedRequestHandler = (req, errors) => {
            this.handleFailedRequest(req, errors);
        };
        this.connection.initialize((s) => {
            Log.d(this, "API Initialization callback", { success: s });
            this.initialized = s;
            runtime.messaging.broadcast(s ? CommonMessages.ApiInitialized : CommonMessages.ApiInitializationFailed, true);
        }, false);
    }
    checkApi() {
        Log.t(this, "Checking API");
        var cutoff = new Date().getTime() - runtime.config.staleApiRequestPeriod;
        var staleRequests = [];
        for (var id in this.pendingRequests) {
            if (this.pendingRequests.hasOwnProperty(id)) {
                var req = this.pendingRequests[id];
                if (SrStats.getStartTime(req.requestId) <= cutoff) {
                    Log.d(this, "Pending request timed out", req);
                    staleRequests.push(req);
                }
            }
        }
        staleRequests.forEach((r) => {
            this.handleStaleRequest(r);
        });
    }
    handleStaleRequest(req) {
        this.sendRequest(req);
    }
    connected() {
        if (!this.initialized) {
            return false;
        }
        return this.connection.connected();
    }
    sendMessage(type, action, content, options, manualCb = null, resendOnFailure = true) {
        if (!this.connected()) {
            Log.e(this, "Attempt to send message against unconnected service", { action: action, content: content });
            return;
        }
        var req = new SrServiceRequest(type, action, content, options || {}, resendOnFailure, manualCb);
        this.sendRequest(req);
        return req.requestId;
    }
    sendRequest(req) {
        if (req.requestId == null) {
            req.requestId = SrStats.start();
        }
        req.sendAttempts++;
        this.pendingRequests[req.requestId] = req;
        this.connection.sendRequest(req);
    }
    handleResponse(resp) {
        Log.d(this, "API Response", { response: resp });
        if (this.pendingRequests[resp.requestId]) {
            var req = this.removeRequest(resp.requestId);
            this.processMessage(req, resp);
        }
    }
    removeRequest(requestId) {
        var origReq = this.pendingRequests[requestId];
        delete this.pendingRequests[requestId];
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
        runtime.messaging.broadcast(resp.action, false, resp);
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
}
//# sourceMappingURL=SrApi.js.map