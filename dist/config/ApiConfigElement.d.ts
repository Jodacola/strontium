import { StrontiumAppConfigElement, IConfigElement } from "./StrontiumAppConfigElement";
import { IApiConnection } from "../lib";
export interface IApiConfig extends IConfigElement {
    connection?: IApiConnection;
}
export default class ApiConfigElement extends StrontiumAppConfigElement<IApiConfig> {
    static defaultProps: IApiConfig;
    config(): any;
}
