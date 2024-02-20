import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import React from "react";
class ServicesConfigElement extends StrontiumAppConfigElement {
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
export default ServicesConfigElement;
//# sourceMappingURL=ServicesConfigElement.js.map