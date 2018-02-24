import { StrontiumAppConfigElement, IConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import StrontiumUiConfig from "./StrontiumUiConfig";
import NavHandler from "../navigation/NavHandler";
import { INavigationHandler } from "../lib";
import * as React from "react";
import NavigationTarget from "../navigation/NavigationTarget";

export interface IUiConfig extends IConfigElement {
    defaultLocation?: string,
    basePath?: string,
    rootElement?: string,
    urlNavigationEnabled?: boolean,
    appTitle?: string,
    appReady?: () => void,
    appInitFailed?: () => void,
    appInitializing?: () => void
}

export default class UiConfig extends StrontiumAppConfigElement<IUiConfig> {
    static defaultProps: IUiConfig = {
        srConfigElementType: ConfigElementTypes.Ui
    };

    config(): any {
        return new StrontiumUiConfig(
            this.props.defaultLocation,
            this.props.basePath,
            this.props.rootElement,
            this.props.urlNavigationEnabled,
            this.props.appTitle,
            this.props.appInitializing,
            this.props.appInitFailed,
            this.props.appReady,
            this.navigationHandlers()
        );
    }

    private navigationHandlers(): INavigationHandler[] {
        let navHandlers: INavigationHandler[] = [];
        React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                let props = child.props;
                navHandlers.push(this.createRoute(props['route'], props['title'], props['view']));
            }
        });
        return navHandlers;
    }

    private createRoute(route: string, title: string, builder: (data: NavigationTarget, parsed: any) => JSX.Element) {
        return new NavHandler(route, title, builder);
    }
}
