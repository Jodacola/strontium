import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
import IApiConnection from "./IApiConnection";
interface IWebApiConnectionDefaults {
    contentType: string;
    cached: boolean;
    process: boolean;
    credentials: RequestCredentials;
}
export default class WebApiConnection implements IApiConnection {
    resourceBase: string;
    defaults: IWebApiConnectionDefaults;
    constructor(resourceBase: string, defaults?: IWebApiConnectionDefaults);
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    protected dataPath(): string;
    protected getMethod(request: SrServiceRequest): string;
    sendRequest(request: SrServiceRequest): void;
    protected fetchInit(method: string, contentType: string, data: string, request: SrServiceRequest): RequestInit;
    protected breakCache(request: SrServiceRequest): boolean;
    protected getContentType(request: SrServiceRequest): any;
    protected getProcessData(request: SrServiceRequest): boolean;
    protected optionOrDefault<T>(key: keyof IWebApiConnectionDefaults, request: SrServiceRequest): T;
    protected checkStatus(response: Response): Response;
    protected handleResponse(response: string, req: SrServiceRequest): void;
    protected handleError(error: any, req: SrServiceRequest): void;
    connected(): boolean;
    onResponse?: (resp: SrServiceResponse) => void;
    onFailedRequest?: (req: SrServiceRequest, error: any[]) => void;
    onServerMessage?: (resp: SrServiceResponse) => void;
}
export {};
