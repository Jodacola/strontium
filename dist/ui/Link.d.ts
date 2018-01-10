/// <reference types="react" />
import * as React from "react";
import UiC from "./SrUiComponent";
export default class Link extends UiC<{
    href?: string;
    alert?: boolean;
    text?: string;
    navTo?: string;
    className?: string;
    onClick?: (e: React.MouseEvent<any>) => void;
}, {}> {
    performRender(): JSX.Element;
}
