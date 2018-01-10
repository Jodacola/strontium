import Utils from "../utils/Utils";

export default class SrServiceResponse {
    requestId: string;
    action: string;
    status: number;
    errors: string[];
    data: any;

    public isGood(): boolean {
        return (this.status >= 200 && this.status < 300 || this.status === 304);
    }

    public errorList(prependMessage: string = null, appendMessage: string = null) {
        let items = [prependMessage];
        items = items.concat(this.errors || []).concat([appendMessage]);
        return items.filter((v) => { return (v !== null && v !== undefined); });
    }
}
