import { StrontiumAppConfigElement, IConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import { IApiConnection } from "../lib";
import StrontiumApiConfig from "./StrontiumApiConfig";

export interface IApiConfig extends IConfigElement {
    connection?: IApiConnection
}

export default class ApiConfigElement extends StrontiumAppConfigElement<IApiConfig> {
    static defaultProps: IApiConfig = {
        srConfigElementType: ConfigElementTypes.Api
    };

    config(): any {
        return new StrontiumApiConfig(this.props.connection);
    }
}
