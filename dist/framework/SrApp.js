import DefaultAppConfig from "../config/DefaultAppConfig";
import Log from "./Log";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
export class SrApp {
    constructor() {
        this.services = {};
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
        this.config.preInitialize();
        this.initializeUi();
        this.initializeApi();
        Log.t(this, "Initialized", { config: this.config });
        this.config.postInitialize();
    }
    initializeMessaging() {
        this.messaging = new SrLocalMessaging();
    }
    initializeUi() {
        this.ui = new SrUi();
        this.ui.initialize(this.config.uiInitializer());
    }
    initializeApi() {
        this.api = new SrApi();
        this.api.initialize(this.config.apiInitializer());
    }
    registerService(svcConstructor, instance = null) {
        if (instance === null || instance === undefined) {
            instance = new svcConstructor();
        }
        Log.t(this, "Registering service", { serviceId: instance.serviceId() });
        if (this.services.hasOwnProperty(instance.serviceId())) {
            Log.e(this, "Service already registered.", { serviceId: instance.serviceId() });
            return;
        }
        this.messaging.registerHandler(instance);
        this.services[instance.serviceId()] = instance;
    }
    getService(svcConstructor) {
        var instance = new svcConstructor();
        if (!this.services[instance.serviceId()]) {
            Log.e(this, "Service not previously registered - initializing and registering", { serviceId: instance.serviceId() });
            this.registerService(svcConstructor, instance);
        }
        return this.services[instance.serviceId()];
    }
}
export let runtime = new SrApp();
//# sourceMappingURL=SrApp.js.map