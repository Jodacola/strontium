import * as React from "react";
import SrUiComponent from "./SrUiComponent";
import CommonMessages from "../messaging/CommonMessages";
export default class AppOverlay extends SrUiComponent {
    initialState() {
        return { show: this.props.show === true };
    }
    getHandles() {
        if (this.props.manuallyShow) {
            return [];
        }
        return [CommonMessages.OverlayOpening, CommonMessages.OverlayClosed];
    }
    onAppMessage(msg) {
        if (msg.action === CommonMessages.OverlayOpening) {
            this.setState({ show: true });
        }
        else {
            this.setState({ show: false });
        }
    }
    performRender() {
        return React.createElement("div", { className: `sr-app-overlay ${(this.state.show ? 'visible' : '')} ${this.props.classes || ''}` });
    }
}
//# sourceMappingURL=AppOverlay.js.map