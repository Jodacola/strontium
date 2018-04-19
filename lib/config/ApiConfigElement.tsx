import { StrontiumAppConfigElement, IConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import { IApiConnection } from "../lib";

export interface IApiConfig extends IConfigElement {
    name?: string,
    connection?: IApiConnection
}

export default class ApiConfigElement extends StrontiumAppConfigElement<IApiConfig> {
    static defaultProps: IApiConfig = {
        srConfigElementType: ConfigElementTypes.Api
    };

    config(): any {
        let conn = this.props.connection;
        conn.name = this.props.name;
        return conn;
    }
}
