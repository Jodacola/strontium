import { StrontiumAppConfigElement, IConfigElement } from "./StrontiumAppConfigElement";
export interface IServicesConfig extends IConfigElement {
}
export default class ServicesConfigElement extends StrontiumAppConfigElement<IServicesConfig> {
    static defaultProps: IServicesConfig;
    config(): any;
    private services;
}
