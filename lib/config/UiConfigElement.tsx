import StrontiumAppConfigElement, { IConfigElement } from "./StrontiumAppConfigElement";
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
    navigateOnQueryChanges?: boolean,
    appTitle?: string,
    appReady?: () => void,
    appInitFailed?: () => void,
    appInitializing?: () => void,
    viewRenderer?: (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any>;
    internalRenderer?: (element: React.ReactElement<any>) => void;
}

export default class UiConfig extends StrontiumAppConfigElement<IUiConfig> {
    static defaultProps: IUiConfig = {
        srConfigElementType: ConfigElementTypes.Ui
    };

    config(): any {
        return new StrontiumUiConfig(
            {
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
                viewRenderer: this.props.viewRenderer,
                containerElement: this.uiElementFor('container'),
                internalRenderer: this.props.internalRenderer
            }
        );
    }

    private uiElementFor(type: string) {
        let element: React.ReactNode | React.ReactNode[] = undefined;
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

    private navigationHandlers(): INavigationHandler[] {
        let navHandlers: INavigationHandler[] = [];
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

    private createRoute(route: string, title: string, builder: (data: NavigationTarget, parsed: any) => JSX.Element) {
        return new NavHandler(route, title, builder);
    }
}
