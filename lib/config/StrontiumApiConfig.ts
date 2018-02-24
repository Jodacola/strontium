import { IApiInitializer } from "./Config";
import { IApiConnection } from "../lib";

export default class StrontiumApiConfig implements IApiInitializer {
    private _conn: IApiConnection;

    constructor(connection: IApiConnection) {
        this._conn = connection;
    }

    buildConnection(): IApiConnection {
        return this._conn;
    }
}