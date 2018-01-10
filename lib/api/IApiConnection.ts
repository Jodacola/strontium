import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";

interface IApiConnection {
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    sendRequest(request: SrServiceRequest): void;
    connected(): boolean;
    responseHandler: (resp: SrServiceResponse) => void;
    failedRequestHandler: (req: SrServiceRequest, status: number, error: string[]) => void;
}

export default IApiConnection;