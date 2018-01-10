import SrServiceResponse from "./SrServiceResponse";
import IApiInitializer from "../config/IApiInitializer";
import RequestType from "./RequestType";
export default class SrApi {
    private initialized;
    private connection;
    private pendingRequests;
    constructor();
    initialize(initializer: IApiInitializer): void;
    checkApi(): void;
    private handleStaleRequest(req);
    connected(): boolean;
    sendMessage(type: RequestType, action: string, content: any, manualCb?: (resp: SrServiceResponse) => void, resendOnFailure?: boolean): string;
    private sendRequest(req);
    private handleResponse(resp);
    private removeRequest(requestId);
    private processMessage(req, resp);
    private handleFailedRequest(req, status, errors);
}
