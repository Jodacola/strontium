/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class Popover extends UiC<{
    id: string;
    title?: string;
    content: JSX.Element;
    placement?: string;
    preventOverlay?: boolean;
}, {}> {
    performRender(): JSX.Element;
    overlayEntering(): void;
    overlayExiting(): void;
}
