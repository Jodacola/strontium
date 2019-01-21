import * as React from "react";

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
