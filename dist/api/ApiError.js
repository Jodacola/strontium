export default class ApiError extends Error {
    constructor(resp) {
        super(resp.statusText);
        this.response = resp;
    }
}
//# sourceMappingURL=ApiError.js.map