import SrAppConfig from "../config/SrAppConfig";
import DefaultAppConfig from "../config/DefaultAppConfig";
import Log from "./Log";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import CM from "../messaging/CommonMessages";
import IAppService from "./IAppService";
import SrServiceContainer from "./SrServiceContainer";
import ApiContainer from "../api/ApiContainer";

export class SrApp {
    public config: SrAppConfig;
    public messaging: SrLocalMessaging;
    public ui: SrUi;
    public services: SrServiceContainer = new SrServiceContainer();
    public apis: ApiContainer;

    private initialized: boolean;

    public initialize(config: SrAppConfig): void {
        if (this.initialized) {
            Log.d(this, "This is already initialized.");
            return;
        }

        this.config = config;

        if (this.config == null) {
            this.config = new DefaultAppConfig();
            Log.w(this, "Initializing with default configuration");
        }

        this.initializeMessaging();
        this.config.setupServices();

        this.config.preInitialize();

        this.initializeUi();
        this.initializeApis();

        Log.t(this, "Initialized", { config: this.config });

        this.config.postInitialize();
    }

    private initializeMessaging(): void {
        Log.t(this, 'Initializing Messaging System');
        this.messaging = new SrLocalMessaging();
    }

    private initializeUi(): void {
        Log.t(this, 'Initializing UI');
        this.ui = new SrUi();
        this.ui.initialize(this.config.uiInitializer());
    }

    private initializeApis(): void {
        Log.t(this, 'Initializing API');
        this.apis = new ApiContainer(this.messaging);
        this.services.register(this.apis);
        (this.config.apiConnections || []).forEach(conn => {
            let name = conn.name || 'default';
            let api = new SrApi(this.messaging);
            this.apis.register(name, api, conn);
        });
        this.apis.initializeApis();
    }
}

export let runtime: SrApp = new SrApp();