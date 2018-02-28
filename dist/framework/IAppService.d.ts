import IMessageHandler from "../messaging/IMessageHandler";
interface IAppService extends IMessageHandler {
    serviceId?: string;
    initialize(): void;
}
export default IAppService;
