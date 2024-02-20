import SrServiceResponse from "./SrServiceResponse";
import RequestType from "./RequestType";

export default class SrServiceRequest {
    public requestId: string = null!;

    constructor(
        public type: RequestType,
        public action: string,
        public content: any,
        public options: any,
        public callbackHandler: (resp: SrServiceResponse) => void = null!) {
    }
}
