import SrServiceResponse from "./SrServiceResponse";
import RequestType from "./RequestType";
export default class SrServiceRequest {
    type: RequestType;
    action: string;
    content: any;
    options: any;
    callbackHandler: (resp: SrServiceResponse) => void;
    requestId: string;
    constructor(type: RequestType, action: string, content: any, options: any, callbackHandler?: (resp: SrServiceResponse) => void);
}
