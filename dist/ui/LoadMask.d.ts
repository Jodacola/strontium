/// <reference types="react" />
import UiC from "./SrUiComponent";
import IApiLoadingState from "../api/IApiLoadingState";
export default class LoadMask extends UiC<{
    state: IApiLoadingState;
}, IApiLoadingState> {
    onNewProps(props: {
        state: IApiLoadingState;
    }): void;
    performRender(): JSX.Element;
}
