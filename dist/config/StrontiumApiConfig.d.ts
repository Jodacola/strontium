import { IApiInitializer } from "./Config";
import { IApiConnection } from "../lib";
export default class StrontiumApiConfig implements IApiInitializer {
    private _conn;
    constructor(connection: IApiConnection);
    buildConnection(): IApiConnection;
}
