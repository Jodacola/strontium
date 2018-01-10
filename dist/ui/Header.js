import * as React from "react";
import UiC from "./SrUiComponent";
export default class Header extends UiC {
    performRender() {
        return React.createElement("h3", { className: this.classes("header", this.props.className) }, this.props.children);
    }
}
//# sourceMappingURL=Header.js.map