import * as React from "react";
import UiC from "./SrUiComponent";
export default class Title extends UiC {
    performRender() {
        return React.createElement("h1", { className: this.classes("title", this.props.className) }, this.props.children);
    }
}
//# sourceMappingURL=Title.js.map