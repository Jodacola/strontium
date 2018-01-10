import * as React from "react";
import UiC from "./SrUiComponent";

export default class Glyph extends UiC<{ glyph: string, classes?: string }, {}>{
    performRender() {
        return (<i
            className={this.classes("glyphicon", `glyphicon-${this.props.glyph}`, this.props.classes)} />);
    }
}