import * as React from "react";
import UiC from "./SrUiComponent";
import Glyph from "./Glyph";
export default class LinkButton extends UiC {
    performRender() {
        var glyph = null;
        if (this.props.glyph) {
            glyph = React.createElement(Glyph, { glyph: this.props.glyph });
        }
        return (React.createElement("span", { onClick: () => { this.clicked(); }, className: "link-button" },
            glyph,
            this.props.label));
    }
    clicked() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}
//# sourceMappingURL=LinkButton.js.map