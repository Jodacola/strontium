import SrServiceResponse from "./SrServiceResponse";
import RequestType from "./RequestType";
export default class SrServiceRequest {
    type: RequestType;
    action: string;
    content: any;
    resendOnFailure: boolean;
    callbackHandler: (resp: SrServiceResponse) => void;
    requestId: string;
    sendAttempts: number;
    constructor(type: RequestType, action: string, content: any, resendOnFailure?: boolean, callbackHandler?: (resp: SrServiceResponse) => void);
}
