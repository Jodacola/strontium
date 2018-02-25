export default class SrServiceResponse {
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
