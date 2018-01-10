import * as React from "react";
import UiC from "./SrUiComponent";
import LoadStates from "../api/LoadStates";
export default class LoadMask extends UiC {
    onNewProps(props) {
        this.set(props.state);
    }
    performRender() {
        if (this.state.loadState === LoadStates.Loading) {
            return React.createElement("div", { className: "load-mask", onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                } });
        }
        return null;
    }
}
//# sourceMappingURL=LoadMask.js.map