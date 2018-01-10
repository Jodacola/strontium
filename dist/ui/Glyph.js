import * as React from "react";
import UiC from "./SrUiComponent";
export default class Glyph extends UiC {
    performRender() {
        return (React.createElement("i", { className: this.classes("glyphicon", `glyphicon-${this.props.glyph}`, this.props.classes) }));
    }
}
//# sourceMappingURL=Glyph.js.map