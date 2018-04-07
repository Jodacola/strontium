/// <reference types="react" />
import UiC from "./SrUiComponent";
export interface IPopoverProps {
    id: string;
    title?: string;
    content: JSX.Element;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    preventOverlay?: boolean;
    rootClose?: boolean;
    container?: any;
}
export default class Popover extends UiC<IPopoverProps, {}> {
    performRender(): JSX.Element;
    overlayEntering(): void;
    overlayExiting(): void;
}
