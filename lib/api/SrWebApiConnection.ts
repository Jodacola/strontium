import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import IApiConnection from "./IApiConnection";
import Log from "../framework/Log";
import RequestType from "./RequestType";

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
        var processData = this.getProcessData(request);

        Log.d(this, "Preparing WebAPI Message", { request: request, method: method, contentType: contentType, processData: processData });
        $.ajax(this.dataPath() + request.action, {
            async: true,
            method: method,
            cache: false,
            data: request.content,
            contentType: contentType,
            processData: processData,
            success: (data: any, status: string, xhr: JQueryXHR) => {
                this.handleResponse(data, status, xhr, request);
            },
            error: (xhr: JQueryXHR, status: string, error: string) => {
                this.handleError(error, status, xhr, request);
            }
        });
    }

    protected getContentType(request: SrServiceRequest): any {
        return "application/json";
    }

    protected getProcessData(request: SrServiceRequest): boolean {
        return true;
    }

    private handleResponse(data: any, status: string, xhr: JQueryXHR, req: SrServiceRequest) {
        if (this.responseHandler != null) {
            var resp = new SrServiceResponse();
            resp.action = req.action;
            resp.requestId = req.requestId;
            resp.data = data;
            resp.status = xhr.status;
            resp.errors = [];
            this.responseHandler(resp);
        } else {
            Log.e(this, "Response received, but no handler available", { request: req, data: data });
        }
    }

    private handleError(status: string, error: string, xhr: JQueryXHR, req: SrServiceRequest) {
        if (this.failedRequestHandler != null) {
            this.failedRequestHandler(req, xhr.status, (xhr.responseJSON || {}).errors);
        } else {
            Log.e(this, "Request failed, but no handler available", { request: req, status: status, error: error, xhr: xhr });
        }
    }

    connected(): boolean {
        return true;
    }

    responseHandler: (resp: SrServiceResponse) => void = null;
    failedRequestHandler: (req: SrServiceRequest, status: number, error: string[]) => void = null;
    directHandler: (resp: SrServiceResponse) => void = null;
}
