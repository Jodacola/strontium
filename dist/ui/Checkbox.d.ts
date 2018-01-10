/// <reference types="react" />
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
    private controlled;
    private inputRef;
    private refHandler;
    initialState(): ICheckboxState;
    focus(): void;
    value(): string;
    onComponentMounted(): void;
    onNewProps(props: ICheckboxProps): void;
    performRender(): JSX.Element;
    changed(e: any): void;
}
