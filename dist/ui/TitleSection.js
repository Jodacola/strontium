import * as React from "react";
import UiC from "./SrUiComponent";
import Title from "./Title";
import Clear from "./Clear";
export default class TitleSection extends UiC {
    performRender() {
        return (React.createElement("div", { className: "title-section" },
            React.createElement("div", { className: "col-sm-6 title-col" },
                React.createElement(Title, { className: this.props.titleClassName }, this.props.titleContent)),
            React.createElement("div", { className: "col-sm-6 content-col" }, this.props.children),
            React.createElement(Clear, null)));
    }
}
//# sourceMappingURL=TitleSection.js.map