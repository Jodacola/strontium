export default class SrServiceRequest {
    constructor(type, action, content, options, resendOnFailure = false, callbackHandler = null) {
        this.type = type;
        this.action = action;
        this.content = content;
        this.options = options;
        this.resendOnFailure = resendOnFailure;
        this.callbackHandler = callbackHandler;
        this.sendAttempts = 0;
    }
}
//# sourceMappingURL=SrServiceRequest.js.map