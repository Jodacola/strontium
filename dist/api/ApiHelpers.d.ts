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
    static create(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Read request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static read(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Update request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static update(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Delete request to the default API.
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static delete(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Create request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static createTo(api: string, resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Read request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static readFrom(api: string, resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Update request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static updateTo(api: string, resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a RequestType.Delete request to the specified API.
     * @param api
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static deleteFrom(api: string, resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    /**
     * Issues a request to the specified API with the desired type and parameters.
     * @param api
     * @param type
     * @param resource
     * @param data
     * @param options
     * @param handler
     */
    static sendRequest(api: string, type: RequestType, resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
}
