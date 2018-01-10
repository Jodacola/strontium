import SrAppConfig from "../config/SrAppConfig";
import DefaultAppConfig from "../config/DefaultAppConfig";
import Log from "./Log";
import SrApi from "../api/SrApi";
import SrLocalMessaging from "../messaging/SrLocalMessaging";
import SrUi from "../ui/SrUi";
import CM from "../messaging/CommonMessages";
import IAppService from "./IAppService";

export class SrApp {
    public config: SrAppConfig;
    public api: SrApi;
    public messaging: SrLocalMessaging;
    public ui: SrUi;

    private initialized: boolean;
    private services: { [key: string]: IAppService } = {};

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

        this.config.preInitialize();

        this.initializeUi();
        this.initializeApi();

        Log.t(this, "Initialized", { config: this.config });
        
        this.config.postInitialize();
    }

    private initializeMessaging(): void {
        this.messaging = new SrLocalMessaging();
    }

    private initializeUi(): void {
        this.ui = new SrUi();
        this.ui.initialize(this.config.uiInitializer());
    }

    private initializeApi(): void {
        this.api = new SrApi();
        this.api.initialize(this.config.apiInitializer());
    }

    public registerService<TService extends IAppService>(svcConstructor: { new (): TService }, instance: TService = null): void {
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

    public getService<TService extends IAppService>(svcConstructor: { new (): TService }): TService {
        var instance = new svcConstructor();
        if (!this.services[instance.serviceId()]) {
            Log.e(this, "Service not previously registered - initializing and registering", { serviceId: instance.serviceId() });
            this.registerService(svcConstructor, instance);
        }
        return this.services[instance.serviceId()] as TService;
    }
}

export let runtime: SrApp = new SrApp();