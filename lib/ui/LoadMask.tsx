import * as React from "react";
import UiC from "./SrUiComponent";
import LoadStates from "../api/LoadStates";
import Alert from "./Alert";

export default class LoadMask extends UiC<{ state: LoadStates }, {}> {
    performRender() {
        if (this.props.state === LoadStates.Loading) {
            return <div className="load-mask" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }} />;
        }
        return null;
    }
}
