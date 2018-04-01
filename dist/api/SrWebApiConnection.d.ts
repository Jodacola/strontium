import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import IApiConnection from "./IApiConnection";
export default class WebApiConnection implements IApiConnection {
    resourceBase: string;
    constructor(resourceBase: string);
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    protected dataPath(): string;
    protected getMethod(request: SrServiceRequest): string;
    sendRequest(request: SrServiceRequest): void;
    protected breakCache(request: SrServiceRequest): boolean;
    protected getContentType(request: SrServiceRequest): any;
    protected getProcessData(request: SrServiceRequest): boolean;
    private checkStatus(response);
    private handleResponse(response, req);
    private handleError(error, req);
    connected(): boolean;
    onResponse: (resp: SrServiceResponse) => void;
    onFailedRequest: (req: SrServiceRequest, error: any[]) => void;
    onServerMessage: (resp: SrServiceResponse) => void;
}
