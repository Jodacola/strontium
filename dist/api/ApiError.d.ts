export default class ApiError extends Error {
    constructor(resp: Response);
    response: Response;
}
