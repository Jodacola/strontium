import SrAppMessage from "./SrAppMessage";
interface IMessageInterceptor {
    action: string;
    passthrough: boolean;
    receiveMessage: (msg: SrAppMessage) => void;
}
export default IMessageInterceptor;
