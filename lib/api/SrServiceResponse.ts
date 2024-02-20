import SrServiceRequest from "./SrServiceRequest";

export default class SrServiceResponse {
    constructor(fromReq?: SrServiceRequest) {
        if (fromReq) {
            this.requestId = fromReq.requestId;
            this.action = fromReq.action;
        }
    }

    requestId: string = undefined!;
    action: string = undefined!;
    good: boolean = undefined!;
    errors: any[] = undefined!;
    data: any = undefined!;

    public errorList(prependMessage: string = null!, appendMessage: string = null!) {
        let items = [prependMessage];
        items = items.concat(this.errors || []).concat([appendMessage]);
        return items.filter((v) => { return (v !== null && v !== undefined); });
    }
}
