import IMessageHandler from "../messaging/IMessageHandler";
interface IAppService extends IMessageHandler {
    serviceId(): string;
}
export default IAppService;
