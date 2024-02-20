import SrServiceRequest from "./SrServiceRequest";
import SrServiceResponse from "./SrServiceResponse";
export default interface IApiConnection {
    name?: string;
    initialize(cb: (r: boolean) => void, reinit: boolean): void;
    sendRequest(request: SrServiceRequest): void;
    connected(): boolean;
    onResponse?: (resp: SrServiceResponse) => void;
    onFailedRequest?: (req: SrServiceRequest, error: any[]) => void;
    onServerMessage?: (resp: SrServiceResponse) => void;
}
