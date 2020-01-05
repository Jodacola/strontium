import SrServiceResponse from "./SrServiceResponse";
import Log from "../framework/Log";
import RequestType from "./RequestType";
import ApiError from "./ApiError";
export default class WebApiConnection {
    constructor(resourceBase, defaults = {
        contentType: 'application/json',
        cached: false,
        process: true,
        credentials: 'same-origin'
    }) {
        this.resourceBase = resourceBase;
        this.defaults = defaults;
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
        window.fetch(this.dataPath() + request.action, this.fetchInit(method, contentType, data, request))
            .then((resp) => this.checkStatus(resp))
            .then((resp) => resp.text())
            .then((body) => this.handleResponse(body, request))
            .catch((error) => this.handleError(error, request));
    }
    fetchInit(method, contentType, data, request) {
        let credentials = this.optionOrDefault('credentials', request);
        let reqInit = {
            method: method,
            body: data,
            credentials: credentials
        };
        if (contentType) {
            reqInit.headers = {
                'Content-Type': contentType
            };
        }
        return reqInit;
    }
    breakCache(request) {
        return !this.optionOrDefault('cached', request);
    }
    getContentType(request) {
        return this.optionOrDefault('contentType', request);
    }
    getProcessData(request) {
        return this.optionOrDefault('process', request) === true;
    }
    optionOrDefault(key, request) {
        var _a;
        if (request.options && Object.keys(request.options).indexOf(key) !== -1) {
            return request.options[key];
        }
        return (_a = this.defaults) === null || _a === void 0 ? void 0 : _a[key];
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