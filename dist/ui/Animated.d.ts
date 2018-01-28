/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class Animated extends UiC<{
    in: boolean;
    appear?: boolean;
    leave?: boolean;
    enter?: boolean;
    step?: number;
    direction?: string;
}, {}> {
    performRender(): JSX.Element;
}
