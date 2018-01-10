import * as React from "react";
import UiC from "./SrUiComponent";
import Glyph from "./Glyph";

export default class LinkButton extends UiC<{ glyph?: string, label: string, onClick?: () => void }, {}> {
    performRender() {
        var glyph: JSX.Element = null;
        if (this.props.glyph) {
            glyph = <Glyph glyph={this.props.glyph} />;
        }
        return (<span onClick={() => { this.clicked(); }} className="link-button">{glyph}{this.props.label}</span>);
    }

    clicked() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}