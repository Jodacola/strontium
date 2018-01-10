/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class WaitSpinner extends UiC<{
    className?: string;
    key?: any;
    message?: any;
    left?: string;
    top?: string;
    fillheight?: string;
    color?: string;
}, {}> {
    private spinner;
    private divRef;
    private refHandler;
    private spinup(ref);
    onComponentWillUnmount(): void;
    performRender(): JSX.Element;
}
