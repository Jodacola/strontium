import * as React from "react";
import UiC from "./SrUiComponent";
import Glyph from "./Glyph";
export default class Button extends UiC {
    performRender() {
        return (React.createElement("a", { href: this.props.href, onClick: (e) => { this.handleClick(e); }, className: this.classes(`std-btn btn btn-${this.props.type || "info"}`, this.props.classes) },
            this.props.glyph ? React.createElement(Glyph, { glyph: this.props.glyph }) : null,
            this.props.children));
    }
    handleClick(e) {
        if (this.props.onClick) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onClick();
        }
    }
}
//# sourceMappingURL=Button.js.map