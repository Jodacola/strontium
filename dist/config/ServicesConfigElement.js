import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import * as React from "react";
export default class ServicesConfigElement extends StrontiumAppConfigElement {
    config() {
        return this.services();
    }
    services() {
        let services = [];
        React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                let props = child.props;
                let service = props['service'];
                service.serviceId = props['id'];
                services.push(service);
            }
        });
        return services;
    }
}
ServicesConfigElement.defaultProps = {
    srConfigElementType: ConfigElementTypes.Services
};
//# sourceMappingURL=ServicesConfigElement.js.map