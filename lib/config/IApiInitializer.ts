import IApiConnection from "../api/IApiConnection";

export default interface IApiInitializer {
    buildConnection(): IApiConnection;
}
