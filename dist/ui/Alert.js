import * as React from "react";
import UiC from "./SrUiComponent";
export default class Alert extends UiC {
    performRender() {
        return React.createElement("div", { className: this.classes(`alert alert-${this.props.type || "info"}`, this.props.classes) }, this.props.children);
    }
}
//# sourceMappingURL=Alert.js.map