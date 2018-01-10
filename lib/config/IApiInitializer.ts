import IApiConnection from "../api/IApiConnection";

interface IApiInitializer {
    buildConnection(): IApiConnection;
}

export default IApiInitializer;