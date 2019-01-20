import SrAppConfig from "../config/SrAppConfig";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import SrServiceContainer from "./SrServiceContainer";
import ApiContainer from "../api/ApiContainer";
export declare class SrApp {
    config: SrAppConfig;
    messaging: SrLocalMessaging;
    ui: SrUi;
    services: SrServiceContainer;
    apis: ApiContainer;
    private initialized;
    initialize(config: SrAppConfig): void;
    private initializeMessaging;
    private initializeUi;
    private initializeApis;
}
export declare let runtime: SrApp;
