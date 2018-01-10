import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import IApiConnection from "./IApiConnection";
export default class WebApiConnection implements IApiConnection {
    resourceBase: string;
    constructor(resourceBase: string);
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    performAuthPing(): boolean;
    protected setupConnection(isReinit: boolean): void;
    protected dataPath(): string;
    protected getMethod(request: SrServiceRequest): string;
    sendRequest(request: SrServiceRequest): void;
    protected getContentType(request: SrServiceRequest): any;
    protected getProcessData(request: SrServiceRequest): boolean;
    private handleResponse(data, status, xhr, req);
    private handleError(status, error, xhr, req);
    connected(): boolean;
    responseHandler: (resp: SrServiceResponse) => void;
    failedRequestHandler: (req: SrServiceRequest, status: number, error: string[]) => void;
    directHandler: (resp: SrServiceResponse) => void;
}
