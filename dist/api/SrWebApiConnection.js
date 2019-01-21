import SrServiceResponse from "./SrServiceResponse";
import Log from "../framework/Log";
import RequestType from "./RequestType";
import ApiError from "./ApiError";
export default class WebApiConnection {
    constructor(resourceBase) {
        this.resourceBase = resourceBase;
    }
    initialize(cb, reinit) {
        cb(true);
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
        var method = this.getMethod(request);
        var contentType = this.getContentType(request);
        let data = request.content;
        if (data && method !== 'GET' && method !== 'HEAD' && this.getProcessData(request)) {
            data = JSON.stringify(data);
        }
        Log.d(this, "Preparing HTTP API Message", { request: request, method: method, contentType: contentType, data: data });
        window.fetch(this.dataPath() + request.action, this.fetchInit(method, contentType, data))
            .then((resp) => this.checkStatus(resp))
            .then((resp) => resp.text())
            .then((body) => this.handleResponse(body, request))
            .catch((error) => this.handleError(error, request));
    }
    fetchInit(method, contentType, data) {
        return {
            method: method,
            headers: {
                'Content-Type': contentType
            },
            body: data,
            credentials: 'same-origin'
        };
    }
    breakCache(request) {
        return (request.options || { cached: false }).cached === false;
    }
    getContentType(request) {
        return (request.options || { contentType: "application/json" }).contentType;
    }
    getProcessData(request) {
        return (request.options || { process: true }).process === true;
    }
    checkStatus(response) {
        if (!(response.ok)) {
            throw new ApiError(response);
        }
        return response;
    }
    handleResponse(response, req) {
        if (this.onResponse) {
            let resp = new SrServiceResponse(req);
            resp.data = response;
            resp.good = true;
            this.onResponse(resp);
        }
        else {
            Log.e(this, "Response received, but no handler available", { request: req, data: response });
        }
    }
    handleError(error, req) {
        if (this.onFailedRequest) {
            if (Object.keys(error).indexOf('response') !== -1) {
                this.onFailedRequest(req, [error.response.status]);
            }
            else {
                this.onFailedRequest(req, [JSON.stringify(error)]);
            }
        }
        else {
            Log.e(this, "Request failed, but no handler available", { request: req, error: error });
        }
    }
    connected() {
        return true;
    }
}
//# sourceMappingURL=SrWebApiConnection.js.map