import UiC from "./SrUiComponent";
import { Spinner } from "spin.js";
import * as React from "react";
export default class WaitSpinner extends UiC {
    constructor() {
        super(...arguments);
        this.spinner = null;
        this.divRef = null;
        this.refHandler = (r) => { this.spinup(r); };
    }
    spinup(ref) {
        this.divRef = ref;
        var so = {
            lines: 11,
            length: 2,
            width: 2,
            radius: 6,
            corners: 1,
            rotate: 0,
            direction: 1,
            color: this.props.color || 'rgba(0,0,0,0.5)',
            speed: 0.8,
            shadow: false,
            className: 'spinner',
            zIndex: 2e9,
            top: (this.props.top == null ? '50%' : this.props.top),
            left: (this.props.left == null ? '16px' : this.props.left)
        };
        this.spinner = new Spinner(so).spin(this.divRef);
    }
    onComponentWillUnmount() {
        if (this.spinner == null)
            return;
        this.spinner.stop();
        this.spinner = null;
    }
    performRender() {
        var style = {};
        if (this.props.fillheight != null) {
            style.height = this.props.fillheight;
        }
        return (React.createElement("div", { className: this.classes("wait-spinner-container", this.props.className) },
            React.createElement("div", { className: "wait-spinner", style: style, ref: this.refHandler }, this.localize(this.props.message))));
    }
}
//# sourceMappingURL=WaitSpinner.js.map