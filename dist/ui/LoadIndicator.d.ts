/// <reference types="react" />
import UiC from "./SrUiComponent";
import IApiLoadingState from "../api/IApiLoadingState";
export default class LoadIndicator extends UiC<{
    alertClassName?: string;
    spinClassName?: string;
    state: IApiLoadingState;
}, IApiLoadingState> {
    onNewProps(props: {
        state: IApiLoadingState;
    }): void;
    performRender(): JSX.Element;
}
