import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
interface IApiConnection {
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    sendRequest(request: SrServiceRequest): void;
    connected(): boolean;
    onResponse: (resp: SrServiceResponse) => void;
    onFailedRequest: (req: SrServiceRequest, error: any[]) => void;
    onServerMessage: (resp: SrServiceResponse) => void;
}
export default IApiConnection;
