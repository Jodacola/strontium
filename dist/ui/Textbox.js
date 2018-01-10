import * as React from "react";
import UiC from "./SrUiComponent";
import Env from "../utils/EnvironmentUtility";
export default class Textbox extends UiC {
    constructor() {
        super(...arguments);
        this.refHandler = (r) => { this.inputRef = r; };
    }
    initialState() {
        this.controlled = (this.props.controlled || this.props.value ? true : false);
        return { value: (this.props.value || this.props.defaultValue || "").toString() };
    }
    focus() {
        this.inputRef.focus();
    }
    value() {
        return this.inputRef.value;
    }
    clear() {
        if (this.inputRef) {
            this.inputRef.value = null;
        }
    }
    onComponentMounted() {
        if (this.props.focus) {
            this.focus();
        }
    }
    onNewProps(props) {
        if (this.controlled) {
            this.set({ value: props.value });
        }
    }
    performRender() {
        if (this.props.textarea === true) {
            return (React.createElement("textarea", { disabled: this.props.disabled, ref: this.refHandler, className: this.props.className, onChange: (e) => { this.changed(e); }, onKeyDown: (e) => { this.onKeyDown(e); }, onKeyPress: (e) => { this.onKeyPressed(e); }, placeholder: this.props.placeholder, defaultValue: this.controlled ? undefined : this.state.value, value: this.controlled ? this.state.value : undefined }));
        }
        return (React.createElement("input", { disabled: this.props.disabled, ref: (r) => { this.setRefAndTooltip(r); }, type: "text", className: this.props.className, onChange: (e) => { this.changed(e); }, onKeyDown: (e) => { this.onKeyDown(e); }, onKeyPress: (e) => { this.onKeyPressed(e); }, placeholder: this.props.placeholder, defaultValue: this.controlled ? undefined : this.state.value, value: this.controlled ? this.state.value : undefined }));
    }
    setRefAndTooltip(r) {
        this.inputRef = r;
        if (this.props.tooltip && Env.bootstrapLoaded()) {
            $(r).tooltip({ 'trigger': 'focus', placement: 'bottom', 'title': this.props.tooltip, 'html': true });
        }
    }
    onKeyPressed(e) {
        if (this.props.textarea !== true &&
            (e.keyCode === 13 || e.charCode === 13) &&
            this.props.onEnter) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onEnter(this.inputRef.value);
        }
        if (this.props.onKeyPressed) {
            this.props.onKeyPressed(e);
        }
    }
    onKeyDown(e) {
        if (this.props.textarea === true &&
            e.ctrlKey &&
            (e.keyCode === 13 || e.charCode === 13) &&
            this.props.onEnter) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onEnter(this.inputRef.value);
        }
        if (this.props.onKeyDown) {
            this.props.onKeyDown(e);
        }
    }
    changed(e) {
        if (this.props.controlled && this.props.autoset) {
            this.set({ value: e.target.value });
        }
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }
}
//# sourceMappingURL=Textbox.js.map