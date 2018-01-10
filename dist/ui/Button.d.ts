/// <reference types="react" />
import * as React from "react";
import UiC from "./SrUiComponent";
export default class Button extends UiC<{
    type?: string;
    classes?: string;
    onClick?: () => void;
    href?: string;
    glyph?: string;
}, {}> {
    performRender(): JSX.Element;
    handleClick(e: React.MouseEvent<any>): void;
}
