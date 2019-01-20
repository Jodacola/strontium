import SrAppMessage from "./SrAppMessage";
export default interface IMessageInterceptor {
    action: string;
    passthrough: boolean;
    receiveMessage: (msg: SrAppMessage) => void;
}
