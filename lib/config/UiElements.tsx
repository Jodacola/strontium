import * as React from "react";
import NavigationTarget from "../navigation/NavigationTarget";

export interface UiElementProps {
    uiElementType?: string
}

export class HeaderElement extends React.Component<UiElementProps, {}> {
    static defaultProps: UiElementProps = {
        uiElementType: 'header'
    };

    render() {
        return null;
    }
}

export class FooterElement extends React.Component<UiElementProps, {}> {
    static defaultProps: UiElementProps = {
        uiElementType: 'footer'
    };

    render() {
        return null;
    }
}

export class ContainerElement extends React.Component<UiElementProps, {}> {
    static defaultProps: UiElementProps = {
        uiElementType: 'container'
    };

    render() {
        return null;
    }
}
