import { runtime } from "../framework/SrApp";
import RequestType from "./RequestType";
import SrServiceResponse from "./SrServiceResponse";

export default class ApiHelpers {
    public static create(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Create, resource, data, options, handler);
    };

    public static read(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Read, resource, data, options, handler);
    };

    public static update(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Update, resource, data, options, handler);
    };

    public static delete(resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Delete, resource, data, options, handler);
    };

    public static sendRequest(type: RequestType, resource: string, data: any = null, options: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return new Promise<SrServiceResponse>(resolve => {
            runtime.api.sendMessage(type, resource, data, options, (r: SrServiceResponse) => {
                resolve(r);
                if (handler) {
                    handler(r);
                }
            });
        });
    }
}