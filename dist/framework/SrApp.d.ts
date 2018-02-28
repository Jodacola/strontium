import SrAppConfig from "../config/SrAppConfig";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import SrServiceContainer from "./SrServiceContainer";
export declare class SrApp {
    config: SrAppConfig;
    api: SrApi;
    messaging: SrLocalMessaging;
    ui: SrUi;
    services: SrServiceContainer;
    private initialized;
    initialize(config: SrAppConfig): void;
    private initializeMessaging();
    private initializeUi();
    private initializeApi();
}
export declare let runtime: SrApp;
