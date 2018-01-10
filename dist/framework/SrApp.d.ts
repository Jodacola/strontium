import SrAppConfig from "../config/SrAppConfig";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import IAppService from "./IAppService";
export declare class SrApp {
    config: SrAppConfig;
    api: SrApi;
    messaging: SrLocalMessaging;
    ui: SrUi;
    private initialized;
    private services;
    initialize(config: SrAppConfig): void;
    private initializeMessaging();
    private initializeUi();
    private initializeApi();
    registerService<TService extends IAppService>(svcConstructor: {
        new (): TService;
    }, instance?: TService): void;
    getService<TService extends IAppService>(svcConstructor: {
        new (): TService;
    }): TService;
}
export declare let runtime: SrApp;
