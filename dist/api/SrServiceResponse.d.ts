import SrServiceRequest from "./SrServiceRequest";
export default class SrServiceResponse {
    constructor(fromReq?: SrServiceRequest);
    requestId: string;
    action: string;
    good: boolean;
    errors: any[];
    data: any;
    errorList(prependMessage?: string, appendMessage?: string): string[];
}
