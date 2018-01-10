export default class SrServiceResponse {
    requestId: string;
    action: string;
    status: number;
    errors: string[];
    data: any;
    isGood(): boolean;
    errorList(prependMessage?: string, appendMessage?: string): string[];
}
