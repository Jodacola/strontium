import SrServiceResponse from "./SrServiceResponse";
import RequestType from "./RequestType";

export default class SrServiceRequest {
    public requestId: string;
    public sendAttempts: number = 0;

    constructor(
        public type: RequestType,
        public action: string,
        public content: any,
        public resendOnFailure: boolean = false,
        public callbackHandler: (resp: SrServiceResponse) => void = null) {

    }
}
