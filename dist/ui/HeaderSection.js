import * as React from "react";
import UiC from "./SrUiComponent";
import Header from "./Header";
import Clear from "./Clear";
export default class HeaderSection extends UiC {
    performRender() {
        return (React.createElement("div", { className: this.classes("header-section", this.props.className) },
            React.createElement("div", { className: "col-sm-6 header-col" },
                React.createElement(Header, { className: this.props.headerClassName }, this.props.headerContent)),
            React.createElement("div", { className: "col-sm-6 content-col" }, this.props.children),
            React.createElement(Clear, null)));
    }
}
//# sourceMappingURL=HeaderSection.js.map