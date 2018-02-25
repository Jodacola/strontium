import { runtime } from "../framework/SrApp";
import RequestType from "./RequestType";
export default class ApiHelpers {
    static create(resource, data = null, options = null, handler = null) {
        return this.sendRequest(RequestType.Create, resource, data, options, handler);
    }
    ;
    static read(resource, data = null, options = null, handler = null) {
        return this.sendRequest(RequestType.Read, resource, data, options, handler);
    }
    ;
    static update(resource, data = null, options = null, handler = null) {
        return this.sendRequest(RequestType.Update, resource, data, options, handler);
    }
    ;
    static delete(resource, data = null, options = null, handler = null) {
        return this.sendRequest(RequestType.Delete, resource, data, options, handler);
    }
    ;
    static sendRequest(type, resource, data = null, options = null, handler = null) {
        return new Promise(resolve => {
            runtime.api.sendMessage(type, resource, data, options, (r) => {
                resolve(r);
                if (handler) {
                    handler(r);
                }
            });
        });
    }
}
//# sourceMappingURL=ApiHelpers.js.map