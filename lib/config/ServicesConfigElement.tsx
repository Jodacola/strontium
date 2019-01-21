import StrontiumAppConfigElement, { IConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import IAppService from "../framework/IAppService";
import * as React from "react";

export interface IServicesConfig extends IConfigElement {
}

export default class ServicesConfigElement extends StrontiumAppConfigElement<IServicesConfig> {
    static defaultProps: IServicesConfig = {
        srConfigElementType: ConfigElementTypes.Services
    };

    config(): any {
        return this.services();
    }

    private services(): IAppService[] {
        let services: IAppService[] = [];
        React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                let props = child.props;
                let service = props['service'] as IAppService;
                service.serviceId = props['id'];
                services.push(service);
            }
        });
        return services;
    }
}
