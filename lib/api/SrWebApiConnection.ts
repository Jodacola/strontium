import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import IApiConnection from "./IApiConnection";
import Log from "../framework/Log";
import RequestType from "./RequestType";
import ApiError from "./ApiError";

export default class WebApiConnection implements IApiConnection {
    constructor(public resourceBase: string) {

    }

    public initialize(cb: (r: boolean) => void, reinit: boolean): void {
        this.setupConnection(reinit);
        cb(true);
    }

    performAuthPing() {
        return true;
    }

    protected setupConnection(isReinit: boolean): void {

    }

    protected dataPath(): string {
        return this.resourceBase;
    }

    protected getMethod(request: SrServiceRequest): string {
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

    sendRequest(request: SrServiceRequest): void {
        var v: JQueryAjaxSettings;

        var method = this.getMethod(request);
        var contentType = this.getContentType(request);
        let data = request.content;
        if (this.getProcessData(request)) {
            data = JSON.stringify(data);
        }

        Log.d(this, "Preparing HTTP API Message", { request: request, method: method, contentType: contentType, data: data });
        window.fetch(this.dataPath() + request.action,
            {
                method: method,
                headers: {
                    'Content-Type': contentType
                },
                body: data,
                credentials: 'same-origin'
            })
            .then((resp) => this.checkStatus(resp))
            .then((resp) => resp.text())
            .then((body) => this.handleResponse(body, request))
            .catch((error) => this.handleError(error, request));
    }

    protected breakCache(request: SrServiceRequest): boolean {
        return (request.options || { cached: false }).cached === false;
    }

    protected getContentType(request: SrServiceRequest): any {
        return (request.options || { contentType: "application/json" }).contentType;
    }

    protected getProcessData(request: SrServiceRequest): boolean {
        return (request.options || { process: true }).process === true;
    }

    private checkStatus(response: Response) {
        if (!(response.ok)) {
            throw new ApiError(response);
        }

        return response;
    }

    private handleResponse(response: string, req: SrServiceRequest) {
        if (this.responseHandler) {
            let resp = new SrServiceResponse();
            resp.action = req.action;
            resp.requestId = req.requestId;
            resp.data = response;
            resp.good = true;
            this.responseHandler(resp);
        } else {
            Log.e(this, "Response received, but no handler available", { request: req, data: response });
        }
    }

    private handleError(error: any, req: SrServiceRequest) {
        if (this.failedRequestHandler != null) {
            if (Object.keys(error).indexOf('response') !== -1) {
                this.failedRequestHandler(req, [error.response.status]);
            } else {
                this.failedRequestHandler(req, [JSON.stringify(error)]);
            }

        } else {
            Log.e(this, "Request failed, but no handler available", { request: req, error: error });
        }
    }

    connected(): boolean {
        return true;
    }

    responseHandler: (resp: SrServiceResponse) => void = null;
    failedRequestHandler: (req: SrServiceRequest, error: any[]) => void = null;
    directHandler: (resp: SrServiceResponse) => void = null;
}
