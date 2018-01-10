import * as React from "react";
import UiC from "./SrUiComponent";
export default class Clear extends UiC {
    performRender() {
        let style = {
            clear: 'both',
            height: '0px !important',
            width: '0px !important',
            padding: '0 !important',
            margin: '0 !important',
            lineHeight: '0 !important'
        };
        return (React.createElement("div", { className: "clear-fix", style: style }));
    }
}
//# sourceMappingURL=Clear.js.map