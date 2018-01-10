import UiC from "./SrUiComponent";
import Log from "../framework/Log";
import { Popover as BsPopover, OverlayTrigger } from "react-bootstrap";
import { runtime } from "../framework/SrApp";
import * as React from "react";
export default class Popover extends UiC {
    performRender() {
        try {
            var popover = (React.createElement(BsPopover, { id: this.props.id, title: this.props.title }, this.props.content));
            return (React.createElement(OverlayTrigger, { trigger: "click", containerPadding: 10, rootClose: true, onEntering: () => { this.overlayEntering(); }, onExiting: () => { this.overlayExiting(); }, overlay: popover, placement: this.props.placement || "bottom" }, this.props.children));
        }
        catch (exc) {
            Log.e(this, 'Unable to create react-bootstrap modal. Please check your bundler config or included libraries.', { exception: exc });
            return null;
        }
    }
    overlayEntering() {
        if (!this.props.preventOverlay) {
            runtime.ui.showOverlay();
        }
    }
    overlayExiting() {
        if (!this.props.preventOverlay) {
            runtime.ui.hideOverlay();
        }
    }
}
//# sourceMappingURL=Popover.js.map