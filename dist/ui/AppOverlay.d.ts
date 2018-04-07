/// <reference types="react" />
import SrUiComponent from "./SrUiComponent";
import SrAppMessage from "../messaging/SrAppMessage";
export default class AppOverlay extends SrUiComponent<{
    manuallyShow?: boolean;
    show?: boolean;
    classes?: string;
}, {
    show: boolean;
}> {
    initialState(): {
        show: boolean;
    };
    getHandles(): string[];
    onAppMessage(msg: SrAppMessage): void;
    performRender(): JSX.Element;
}
