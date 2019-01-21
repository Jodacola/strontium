import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import StrontiumUiConfig from "./StrontiumUiConfig";
import NavHandler from "../navigation/NavHandler";
import * as React from "react";
export default class UiConfig extends StrontiumAppConfigElement {
    config() {
        return new StrontiumUiConfig({
            defaultLocation: this.props.defaultLocation,
            basePath: this.props.basePath,
            rootElement: this.props.rootElement,
            urlNavEnabled: this.props.urlNavigationEnabled,
            navigateOnQueryChange: this.props.navigateOnQueryChanges,
            appTitle: this.props.appTitle,
            appInitializing: this.props.appInitializing,
            appInitFailed: this.props.appInitFailed,
            appReady: this.props.appReady,
            navHandlers: this.navigationHandlers(),
            headerElement: this.uiElementFor('header'),
            footerElement: this.uiElementFor('footer'),
            containerElement: this.uiElementFor('container')
        });
    }
    uiElementFor(type) {
        let element = undefined;
        React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                let props = child.props;
                if (props['uiElementType'] === type) {
                    element = props['children'];
                }
            }
        });
        return element;
    }
    navigationHandlers() {
        let navHandlers = [];
        React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                let props = child.props;
                if (Object.keys(props).indexOf('uiElementType') === -1) {
                    navHandlers.push(this.createRoute(props['route'], props['title'], props['view']));
                }
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