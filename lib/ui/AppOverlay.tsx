import * as React from "react";
import SrUiComponent from "./SrUiComponent";
import CommonMessages from "../messaging/CommonMessages";
import SrAppMessage from "../messaging/SrAppMessage";

export default class AppOverlay extends SrUiComponent<{ manuallyShow?: boolean, show?: boolean, classes?: string }, { show: boolean }> {
    initialState() {
        return { show: this.props.show === true };
    }

    getHandles() {
        if (this.props.manuallyShow) {
            return [];
        }

        return [CommonMessages.OverlayOpening, CommonMessages.OverlayClosed];
    }

    onAppMessage(msg: SrAppMessage) {
        if (msg.action === CommonMessages.OverlayOpening) {
            this.setState({ show: true });
        } else {
            this.setState({ show: false });
        }
    }

    performRender() {
        return <div className={`sr-app-overlay ${(this.state.show ? 'visible' : '')} ${this.props.classes || ''}`}></div>;
    }
}
