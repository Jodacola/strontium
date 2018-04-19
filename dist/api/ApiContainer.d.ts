import SrApi from "./SrApi";
import { IAppService, SrAppMessage, IApiConnection } from "../lib";
import IAppMessaging from "../messaging/IAppMessaging";
export default class ApiContainer implements IAppService {
    private _apiMap;
    private _messaging;
    serviceId: string;
    constructor(messaging: IAppMessaging);
    get(name: string): SrApi;
    register(name: string, api: SrApi, connection: IApiConnection): void;
    initialize(): void;
    handles(): string[];
    receiveMessage(msg: SrAppMessage): void;
    finalizeIfAllResponded(): void;
    initializeApis(): void;
}
