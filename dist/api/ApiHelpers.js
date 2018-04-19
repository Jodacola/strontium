import { runtime } from "../framework/SrApp";
import RequestType from "./RequestType";
export default class ApiHelpers {
    /**
     * Issues a RequestType.Create request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static create(resource, data = null, options = null, handler = null) {
        return this.sendRequest('default', RequestType.Create, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Read request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static read(resource, data = null, options = null, handler = null) {
        return this.sendRequest('default', RequestType.Read, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Update request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static update(resource, data = null, options = null, handler = null) {
        return this.sendRequest('default', RequestType.Update, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Delete request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static delete(resource, data = null, options = null, handler = null) {
        return this.sendRequest('default', RequestType.Delete, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Create request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static createTo(api, resource, data = null, options = null, handler = null) {
        return this.sendRequest(api, RequestType.Create, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Read request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static readFrom(api, resource, data = null, options = null, handler = null) {
        return this.sendRequest(api, RequestType.Read, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Update request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static updateTo(api, resource, data = null, options = null, handler = null) {
        return this.sendRequest(api, RequestType.Update, resource, data, options, handler);
    }
    ;
    /**
     * Issues a RequestType.Delete request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static deleteFrom(api, resource, data = null, options = null, handler = null) {
        return this.sendRequest(api, RequestType.Delete, resource, data, options, handler);
    }
    ;
    /**
     * Issues a request to the specified API with the desired type and parameters.
     * @param api
     * @param type
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static sendRequest(api, type, resource, data = null, options = null, handler = null) {
        return new Promise(resolve => {
            let targetApi = runtime.apis.get(api);
            targetApi.sendMessage(type, resource, data, options, (r) => {
                resolve(r);
                if (handler) {
                    handler(r);
                }
            });
        });
    }
}
//# sourceMappingURL=ApiHelpers.js.map