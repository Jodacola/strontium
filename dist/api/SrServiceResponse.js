export default class SrServiceResponse {
    errorList(prependMessage = null, appendMessage = null) {
        let items = [prependMessage];
        items = items.concat(this.errors || []).concat([appendMessage]);
        return items.filter((v) => { return (v !== null && v !== undefined); });
    }
}
//# sourceMappingURL=SrServiceResponse.js.map