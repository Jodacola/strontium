import IApiConnection from "./IApiConnection";
import SrServiceResponse from "./SrServiceResponse";
import RequestType from "./RequestType";
import IAppMessaging from "../messaging/IAppMessaging";
export default class SrApi {
    private _initialized;
    private _connection;
    private _pendingRequests;
    private _messaging;
    constructor(messaging: IAppMessaging);
    initialize(conn: IApiConnection): void;
    checkConnection(conn: IApiConnection): boolean;
    initializeConnection(conn: IApiConnection): void;
    attachConnection(conn: IApiConnection): void;
    connected(): boolean;
    sendMessage(type: RequestType, action: string, content: any, options: any, manualCb?: (resp: SrServiceResponse) => void): string;
    private sendRequest(req);
    private handleResponse(resp);
    private removeRequest(requestId);
    private processMessage(req, resp);
    private handleFailedRequest(req, errors);
    private handleDirectMessage(resp);
}
