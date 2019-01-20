import IAppService from "./IAppService";
export default class SrServiceContainer {
    private services;
    private checkServiceId;
    get<TService extends IAppService>(id: string): TService;
    register(service: IAppService): void;
    deregister(serviceId: string): void;
}
