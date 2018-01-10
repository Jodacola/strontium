import * as React from "react";
import UiC from "./SrUiComponent";

export interface ICheckboxProps {
    label?: string;
    id: string;
    defaultChecked?: boolean;
    checked?: boolean;
    controlled?: boolean;
    autoset?: boolean;
    disabled?: boolean;
    focus?: boolean;
    className?: string;
    onChange?: (checked: boolean) => void;
}

export interface ICheckboxState {
    checked: boolean;
}

export default class Checkbox extends UiC<ICheckboxProps, ICheckboxState> {
    private controlled: boolean;
    private inputRef: HTMLInputElement;
	private refHandler: (r:HTMLInputElement) => void = (r) => { this.inputRef = r; }
	
    initialState(): ICheckboxState {
        this.controlled = ((this.props.controlled || this.props.checked) !== undefined);
        var value: boolean = this.props.checked || this.props.defaultChecked || false;
        return { checked: value };
    }

    public focus() {
        this.inputRef.focus();
    }

    public value() {
        return this.inputRef.value;
    }

    onComponentMounted(): void {
        if (this.props.focus) {
            this.focus();
        }
    }

    onNewProps(props: ICheckboxProps) {
        if (this.controlled) {
            this.set({ checked: props.checked || false });
        }
    }

    performRender() {
        return (
            <div className={this.classes("checkbox-input", this.props.className)}>
                {this.props.label ? <label htmlFor={this.props.id}>{this.props.label}</label> : null}
                <input
                    type="checkbox"
                    disabled={this.props.disabled}
                    ref={this.refHandler}
                    onChange={(e) => { this.changed(e); }}
                    name={this.props.id}
                    id={this.props.id}
                    defaultChecked={this.controlled ? undefined : this.state.checked}
                    checked={this.controlled ? this.state.checked : undefined} />
            </div>);
    }

    changed(e: any) {
        if (this.props.controlled && this.props.autoset) {
            this.set({ checked: e.target.checked });
        }
        if (this.props.onChange) {
            this.props.onChange(e.target.checked);
        }
    }
}