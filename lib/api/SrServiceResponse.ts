import SrServiceRequest from "./SrServiceRequest";

export default class SrServiceResponse {
    constructor(fromReq?: SrServiceRequest) {
        if (fromReq) {
            this.requestId = fromReq.requestId;
            this.action = fromReq.action;
        }
    }

    requestId: string;
    action: string;
    good: boolean;
    errors: any[];
    data: any;

    public errorList(prependMessage: string = null, appendMessage: string = null) {
        let items = [prependMessage];
        items = items.concat(this.errors || []).concat([appendMessage]);
        return items.filter((v) => { return (v !== null && v !== undefined); });
    }
}
