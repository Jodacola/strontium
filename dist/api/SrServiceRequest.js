export default class SrServiceRequest {
    constructor(type, action, content, options, callbackHandler = null) {
        this.type = type;
        this.action = action;
        this.content = content;
        this.options = options;
        this.callbackHandler = callbackHandler;
        this.requestId = null;
    }
}
//# sourceMappingURL=SrServiceRequest.js.map