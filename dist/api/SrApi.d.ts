import IApiConnection from "./IApiConnection";
import SrServiceResponse from "./SrServiceResponse";
import RequestType from "./RequestType";
import IAppMessaging from "../messaging/IAppMessaging";
export default class SrApi {
    private _initialized;
    private _connection?;
    private _pendingRequests;
    private _messaging;
    constructor(messaging: IAppMessaging);
    initialize(conn: IApiConnection): void;
    checkConnection(conn: IApiConnection): boolean;
    initializeConnection(conn: IApiConnection): void;
    attachConnection(conn: IApiConnection): void;
    connected(): boolean;
    sendMessage(type: RequestType, action: string, content: any, options: any, manualCb: (resp: SrServiceResponse) => void): string | undefined;
    private sendRequest;
    private handleResponse;
    private removeRequest;
    private processMessage;
    private handleFailedRequest;
    private handleDirectMessage;
}
