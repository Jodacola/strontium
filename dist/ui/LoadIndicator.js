import * as React from "react";
import UiC from "./SrUiComponent";
import LoadStates from "../api/LoadStates";
import WaitSpinner from "./WaitSpinner";
import Alert from "./Alert";
export default class LoadIndicator extends UiC {
    onNewProps(props) {
        this.set(props.state);
    }
    performRender() {
        var content = null;
        if (this.state.loadState === LoadStates.Succeeded && this.state.successMessage) {
            content = React.createElement(Alert, { key: "load-success", type: "success", classes: this.classes("load", this.props.alertClassName) }, this.state.successMessage);
        }
        else if (this.state.loadState === LoadStates.Failed && this.state.errorMessage) {
            content = React.createElement(Alert, { key: "load-error", type: "danger", classes: this.classes("load", this.props.alertClassName) }, this.state.errorMessage);
        }
        else if (this.state.loadState === LoadStates.Loading) {
            content = React.createElement(WaitSpinner, { className: this.props.spinClassName, key: "load-loading", message: this.state.loadingMessage });
        }
        return content;
    }
}
//# sourceMappingURL=LoadIndicator.js.map