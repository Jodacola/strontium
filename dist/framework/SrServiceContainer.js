import Log from "./Log";
import { runtime } from "./SrApp";
export default class SrServiceContainer {
    constructor() {
        this.services = {};
    }
    checkServiceId(id) {
        if (!id) {
            throw new Error('Unable to get service with no id');
        }
    }
    get(id) {
        this.checkServiceId(id);
        Log.t(this, `Getting service ${id}`);
        if (!this.services[id]) {
            Log.w(this, `Service ${id} is not registered in the service container.`);
        }
        return this.services[id];
    }
    register(service) {
        this.checkServiceId(service.serviceId);
        Log.t(this, `Registring service: ${service.serviceId}`);
        if (this.services[service.serviceId]) {
            Log.w(this, `Service ${service.serviceId} was already registered.  Overwriting.`);
            this.deregister(service.serviceId);
        }
        this.services[service.serviceId] = service;
        runtime.messaging.registerHandler(service);
        service.initialize();
    }
    deregister(serviceId) {
        this.checkServiceId(serviceId);
        Log.t(this, `Deregistering service: ${serviceId}`);
        if (!this.services[serviceId]) {
            Log.w(this, `Service ${serviceId} is not registered.  Nothing to deregister.`);
            return;
        }
        runtime.messaging.removeHandler(this.services[serviceId]);
        this.services[serviceId] = null;
    }
}
//# sourceMappingURL=SrServiceContainer.js.map