/// <reference types="react" />
import UiC from "./SrUiComponent";
import IApiLoadingState from "../api/IApiLoadingState";
import LoadStates from "../api/LoadStates";
export interface ILoadIndicatorProps {
    alertClassName?: string;
    spinClassName?: string;
    state: LoadStates;
    loadingMessage?: string;
    errorMessage?: string;
}
export default class LoadIndicator extends UiC<{
    alertClassName?: string;
    spinClassName?: string;
    state: LoadStates;
    loadingMessage?: string;
    errorMessage?: string;
}, IApiLoadingState> {
    initialState(): {
        loadState: LoadStates;
        successMessage: any;
        errorMessage: string;
        loadingMessage: string;
    };
    onNewProps(props: ILoadIndicatorProps): void;
    performRender(): JSX.Element;
}
