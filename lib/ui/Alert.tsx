import * as React from "react";
import UiC from "./SrUiComponent";

export default class Alert extends UiC<{ type?: string, classes?: string }, {}> {
    performRender() {
        return <div className={this.classes(`alert alert-${this.props.type || "info"}`, this.props.classes)}>{this.props.children}</div>;
    }
}