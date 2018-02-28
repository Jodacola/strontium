import DefaultAppConfig from "../config/DefaultAppConfig";
import Log from "./Log";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import SrServiceContainer from "./SrServiceContainer";
export class SrApp {
    constructor() {
        this.services = new SrServiceContainer();
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
        this.initializeApi();
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
    initializeApi() {
        Log.t(this, 'Initializing API');
        this.api = new SrApi();
        this.api.initialize(this.config.apiInitializer());
    }
}
export let runtime = new SrApp();
//# sourceMappingURL=SrApp.js.map