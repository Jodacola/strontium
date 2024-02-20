export default class SrServiceResponse {
    constructor(fromReq) {
        this.requestId = undefined;
        this.action = undefined;
        this.good = undefined;
        this.errors = undefined;
        this.data = undefined;
        if (fromReq) {
            this.requestId = fromReq.requestId;
            this.action = fromReq.action;
        }
    }
    errorList(prependMessage = null, appendMessage = null) {
        let items = [prependMessage];
        items = items.concat(this.errors || []).concat([appendMessage]);
        return items.filter((v) => { return (v !== null && v !== undefined); });
    }
}
//# sourceMappingURL=SrServiceResponse.js.map