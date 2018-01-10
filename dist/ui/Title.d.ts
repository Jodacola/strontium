/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class Title extends UiC<{
    className?: string;
}, {}> {
    performRender(): JSX.Element;
}
