import * as React from "react";
import UiC from "./SrUiComponent";
import Glyph from "./Glyph";

export default class Button extends UiC<{ type?: string, classes?: string, onClick?: () => void, href?: string, glyph?: string }, {}> {
    performRender() {
        return (
            <a
                href={this.props.href}
                onClick={(e) => { this.handleClick(e); }}
                className={this.classes(`std-btn btn btn-${this.props.type || "info"}`, this.props.classes)}>
                {this.props.glyph ? <Glyph glyph={this.props.glyph} /> : null}
                {this.props.children}
            </a>);
    }

    handleClick(e: React.MouseEvent<any>) {
        if (this.props.onClick) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onClick();
        }
    }
}