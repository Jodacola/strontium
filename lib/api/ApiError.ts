export default class ApiError extends Error {
    constructor(resp: Response) {
        super(resp.statusText);
        this.response = resp;
    }

    response: Response;
}