import * as React from "react";
import UiC from "./SrUiComponent";
export default class Checkbox extends UiC {
    constructor() {
        super(...arguments);
        this.refHandler = (r) => { this.inputRef = r; };
    }
    initialState() {
        this.controlled = ((this.props.controlled || this.props.checked) !== undefined);
        var value = this.props.checked || this.props.defaultChecked || false;
        return { checked: value };
    }
    focus() {
        this.inputRef.focus();
    }
    value() {
        return this.inputRef.value;
    }
    onComponentMounted() {
        if (this.props.focus) {
            this.focus();
        }
    }
    onNewProps(props) {
        if (this.controlled) {
            this.set({ checked: props.checked || false });
        }
    }
    performRender() {
        return (React.createElement("div", { className: this.classes("checkbox-input", this.props.className) },
            this.props.label ? React.createElement("label", { htmlFor: this.props.id }, this.props.label) : null,
            React.createElement("input", { type: "checkbox", disabled: this.props.disabled, ref: this.refHandler, onChange: (e) => { this.changed(e); }, name: this.props.id, id: this.props.id, defaultChecked: this.controlled ? undefined : this.state.checked, checked: this.controlled ? this.state.checked : undefined })));
    }
    changed(e) {
        if (this.props.controlled && this.props.autoset) {
            this.set({ checked: e.target.checked });
        }
        if (this.props.onChange) {
            this.props.onChange(e.target.checked);
        }
    }
}
//# sourceMappingURL=Checkbox.js.map