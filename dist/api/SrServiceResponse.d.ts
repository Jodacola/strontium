export default class SrServiceResponse {
    requestId: string;
    action: string;
    good: boolean;
    errors: any[];
    data: any;
    errorList(prependMessage?: string, appendMessage?: string): string[];
}
