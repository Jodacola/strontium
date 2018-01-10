/// <reference types="react" />
import UiC from "./SrUiComponent";
export interface IModalProps {
    title: string;
    className?: string;
    footerContent?: JSX.Element;
    labelledBy?: string;
    closeButton?: boolean;
    staticBackground?: boolean;
    show?: boolean;
    onClose?: () => void;
}
export default class Modal extends UiC<IModalProps, {}> {
    private _canUse;
    private canUse();
    performRender(): JSX.Element;
    modalClasses(): string;
}
