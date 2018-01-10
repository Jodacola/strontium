/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class ErrorBoundary extends UiC<{}, {
    hasError: boolean;
    error: any;
    info: any;
}> {
    initialState(): {
        hasError: boolean;
        error: any;
        info: any;
    };
    componentDidCatch(error: any, info: any): void;
    performRender(): JSX.Element;
}
