import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";

interface IApiConnection {
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    sendRequest(request: SrServiceRequest): void;
    connected(): boolean;
    responseHandler: (resp: SrServiceResponse) => void;
    failedRequestHandler: (req: SrServiceRequest, error: any[]) => void;
}

export default IApiConnection;