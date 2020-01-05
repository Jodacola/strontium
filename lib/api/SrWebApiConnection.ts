import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import IApiConnection from "./IApiConnection";
import Log from "../framework/Log";
import RequestType from "./RequestType";
import ApiError from "./ApiError";

interface IWebApiConnectionDefaults {
    contentType: string,
    cached: boolean,
    process: boolean,
    credentials: RequestCredentials
}

export default class WebApiConnection implements IApiConnection {
    constructor(public resourceBase: string, public defaults: IWebApiConnectionDefaults = {
        contentType: 'application/json',
        cached: false,
        process: true,
        credentials: 'same-origin'
    }) {

    }

    public initialize(cb: (r: boolean) => void, reinit: boolean): void {
        cb(true);
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

    protected fetchInit(method: string, contentType: string, data: string, request: SrServiceRequest): RequestInit {
        let credentials = this.optionOrDefault<RequestCredentials>('credentials', request);

        let reqInit: RequestInit = {
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

    protected breakCache(request: SrServiceRequest): boolean {
        return !this.optionOrDefault('cached', request);
    }

    protected getContentType(request: SrServiceRequest): any {
        return this.optionOrDefault('contentType', request);
    }

    protected getProcessData(request: SrServiceRequest): boolean {
        return this.optionOrDefault('process', request) === true;
    }

    protected optionOrDefault<T>(key: keyof IWebApiConnectionDefaults, request: SrServiceRequest): T {
        if (request.options && Object.keys(request.options).indexOf(key) !== -1) {
            return request.options[key];
        }

        return this.defaults?.[key] as any;
    }

    protected checkStatus(response: Response) {
        if (!(response.ok)) {
            throw new ApiError(response);
        }

        return response;
    }

    protected handleResponse(response: string, req: SrServiceRequest) {
        if (this.onResponse) {
            let resp = new SrServiceResponse(req);
            resp.data = response;
            resp.good = true;
            this.onResponse(resp);
        } else {
            Log.e(this, "Response received, but no handler available", { request: req, data: response });
        }
    }

    protected handleError(error: any, req: SrServiceRequest) {
        if (this.onFailedRequest) {
            if (Object.keys(error).indexOf('response') !== -1) {
                this.onFailedRequest(req, [error.response.status]);
            } else {
                this.onFailedRequest(req, [JSON.stringify(error)]);
            }

        } else {
            Log.e(this, "Request failed, but no handler available", { request: req, error: error });
        }
    }

    connected(): boolean {
        return true;
    }

    onResponse: (resp: SrServiceResponse) => void;
    onFailedRequest: (req: SrServiceRequest, error: any[]) => void;
    onServerMessage: (resp: SrServiceResponse) => void;
}
