import { runtime } from "../framework/SrApp";
import RequestType from "./RequestType";
import SrServiceResponse from "./SrServiceResponse";

export default class ApiHelpers {
    /**
     * Issues a RequestType.Create request to the default API.
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static create(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest('default', RequestType.Create, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Read request to the default API.
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static read(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest('default', RequestType.Read, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Update request to the default API.
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static update(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest('default', RequestType.Update, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Delete request to the default API.
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static delete(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest('default', RequestType.Delete, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Create request to the specified API.
     * @param api 
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static createTo(api: string, resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(api, RequestType.Create, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Read request to the specified API.
     * @param api 
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static readFrom(api: string, resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(api, RequestType.Read, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Update request to the specified API.
     * @param api 
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static updateTo(api: string, resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(api, RequestType.Update, resource, data, options, handler);
    };

    /**
     * Issues a RequestType.Delete request to the specified API.
     * @param api 
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static deleteFrom(api: string, resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(api, RequestType.Delete, resource, data, options, handler);
    };

    /**
     * Issues a request to the specified API with the desired type and parameters.
     * @param api 
     * @param type 
     * @param resource 
     * @param data 
     * @param options 
     * @param handler 
     */
    public static sendRequest(api: string, type: RequestType, resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return new Promise<SrServiceResponse>(resolve => {
            let targetApi = runtime.apis.get(api);
            targetApi.sendMessage(type, resource, data, options, (r: SrServiceResponse) => {
                resolve(r);
                if (handler) {
                    handler(r);
                }
            });
        });
    }
}