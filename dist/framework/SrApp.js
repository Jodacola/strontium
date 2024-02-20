import DefaultAppConfig from "../config/DefaultAppConfig";
import Log from "./Log";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import SrServiceContainer from "./SrServiceContainer";
import ApiContainer from "../api/ApiContainer";
export class SrApp {
    constructor() {
        this.config = undefined;
        this.messaging = undefined;
        this.ui = undefined;
        this.services = new SrServiceContainer();
        this.apis = undefined;
        this.initialized = false;
    }
    initialize(config) {
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
    initializeMessaging() {
        Log.t(this, 'Initializing Messaging System');
        this.messaging = new SrLocalMessaging();
    }
    initializeUi() {
        Log.t(this, 'Initializing UI');
        this.ui = new SrUi();
        this.ui.initialize(this.config.uiInitializer());
    }
    initializeApis() {
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
export let runtime = new SrApp();
//# sourceMappingURL=SrApp.js.map