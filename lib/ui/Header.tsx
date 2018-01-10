import * as React from "react";
import UiC from "./SrUiComponent";

export default class Header extends UiC<{ className?: string }, {}> {
    performRender() {
        return <h3 className={this.classes("header", this.props.className)}>{this.props.children}</h3>;
    }
}
