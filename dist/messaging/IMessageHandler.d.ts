import SrAppMessage from "./SrAppMessage";
export default interface IMessageHandler {
    handles(): string[];
    receiveMessage(msg: SrAppMessage): void;
}
