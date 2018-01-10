import SrAppMessage from "./SrAppMessage";

interface IMessageHandler {
    handles(): string[];
    handlesLocal(): string[];
    receiveMessage(msg: SrAppMessage): void;
}

export default IMessageHandler;