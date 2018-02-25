import RequestType from "./RequestType";
import SrServiceResponse from "./SrServiceResponse";
export default class ApiHelpers {
    static create(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    static read(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    static update(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    static delete(resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    static sendRequest(type: RequestType, resource: string, data?: any, options?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
}
