import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import StrontiumUiConfig from "./StrontiumUiConfig";
import NavHandler from "../navigation/NavHandler";
import * as React from "react";
export default class UiConfig extends StrontiumAppConfigElement {
    config() {
        return new StrontiumUiConfig(this.props.defaultLocation, this.props.basePath, this.props.rootElement, this.props.urlNavigationEnabled, this.props.navigateOnQueryChanges, this.props.appTitle, this.props.appInitializing, this.props.appInitFailed, this.props.appReady, this.navigationHandlers());
    }
    navigationHandlers() {
        let navHandlers = [];
        React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                let props = child.props;
                navHandlers.push(this.createRoute(props['route'], props['title'], props['view']));
            }
        });
        return navHandlers;
    }
    createRoute(route, title, builder) {
        return new NavHandler(route, title, builder);
    }
}
UiConfig.defaultProps = {
    srConfigElementType: ConfigElementTypes.Ui
};
//# sourceMappingURL=UiConfigElement.js.map