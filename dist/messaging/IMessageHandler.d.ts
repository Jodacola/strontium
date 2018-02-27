import SrAppMessage from "./SrAppMessage";
interface IMessageHandler {
    handles(): string[];
    receiveMessage(msg: SrAppMessage): void;
}
export default IMessageHandler;
