import SrServiceResponse from "./SrServiceResponse";
import Log from "../framework/Log";
import RequestType from "./RequestType";
export default class WebApiConnection {
    constructor(resourceBase) {
        this.resourceBase = resourceBase;
        this.responseHandler = null;
        this.failedRequestHandler = null;
        this.directHandler = null;
    }
    initialize(cb, reinit) {
        this.setupConnection(reinit);
        cb(true);
    }
    performAuthPing() {
        return true;
    }
    setupConnection(isReinit) {
    }
    dataPath() {
        return this.resourceBase;
    }
    getMethod(request) {
        switch (request.type) {
            case RequestType.Create:
                return "POST";
            case RequestType.Delete:
                return "DELETE";
            case RequestType.Update:
                return "PATCH";
            default:
                return "GET";
        }
    }
    sendRequest(request) {
        var v;
        var method = this.getMethod(request);
        var contentType = this.getContentType(request);
        var processData = this.getProcessData(request);
        Log.d(this, "Preparing WebAPI Message", { request: request, method: method, contentType: contentType, processData: processData });
        $.ajax(this.dataPath() + request.action, {
            async: true,
            method: method,
            cache: false,
            data: request.content,
            contentType: contentType,
            processData: processData,
            success: (data, status, xhr) => {
                this.handleResponse(data, status, xhr, request);
            },
            error: (xhr, status, error) => {
                this.handleError(error, status, xhr, request);
            }
        });
    }
    getContentType(request) {
        return "application/x-www-form-urlencoded; charset=UTF-8";
    }
    getProcessData(request) {
        return true;
    }
    handleResponse(data, status, xhr, req) {
        if (this.responseHandler != null) {
            var resp = new SrServiceResponse();
            resp.action = req.action;
            resp.requestId = req.requestId;
            resp.data = (data || {}).data;
            resp.status = xhr.status;
            resp.errors = (data || {}).errors;
            this.responseHandler(resp);
        }
        else {
            Log.e(this, "Response received, but no handler available", { request: req, data: data });
        }
    }
    handleError(status, error, xhr, req) {
        if (this.failedRequestHandler != null) {
            this.failedRequestHandler(req, xhr.status, (xhr.responseJSON || {}).errors);
        }
        else {
            Log.e(this, "Request failed, but no handler available", { request: req, status: status, error: error, xhr: xhr });
        }
    }
    connected() {
        return true;
    }
}
//# sourceMappingURL=SrWebApiConnection.js.map