export default class SrServiceResponse {
    isGood() {
        return (this.status >= 200 && this.status < 300 || this.status === 304);
    }
    errorList(prependMessage = null, appendMessage = null) {
        let items = [prependMessage];
        items = items.concat(this.errors || []).concat([appendMessage]);
        return items.filter((v) => { return (v !== null && v !== undefined); });
    }
}
//# sourceMappingURL=SrServiceResponse.js.map