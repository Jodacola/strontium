import * as React from "react";
import UiC from "./SrUiComponent";

export default class Title extends UiC<{className?:string},{}> {
    performRender() {
        return <h1 className={this.classes("title", this.props.className)}>{this.props.children}</h1>;
    }
}
