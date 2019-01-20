import IMessageHandler from "../messaging/IMessageHandler";
export default interface IAppService extends IMessageHandler {
    serviceId?: string;
    initialize(): void;
}
