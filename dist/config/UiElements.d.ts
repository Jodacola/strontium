/// <reference types="react" />
import * as React from "react";
export interface UiElementProps {
    uiElementType?: string;
}
export declare class HeaderElement extends React.Component<UiElementProps, {}> {
    static defaultProps: UiElementProps;
    render(): any;
}
export declare class FooterElement extends React.Component<UiElementProps, {}> {
    static defaultProps: UiElementProps;
    render(): any;
}
export declare class ContainerElement extends React.Component<UiElementProps, {}> {
    static defaultProps: UiElementProps;
    render(): any;
}
