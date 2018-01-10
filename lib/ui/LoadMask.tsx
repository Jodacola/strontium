import * as React from "react";
import UiC from "./SrUiComponent";
import IApiLoadingState from "../api/IApiLoadingState";
import LoadStates from "../api/LoadStates";
import Alert from "./Alert";

export default class LoadMask extends UiC<{ state: IApiLoadingState }, IApiLoadingState> {
    onNewProps(props: { state: IApiLoadingState }): void {
        this.set(props.state);
    }

    performRender() {
        if (this.state.loadState === LoadStates.Loading) {
            return <div className="load-mask" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }} />;
        }
        return null;
    }
}
