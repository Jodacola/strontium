/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class Header extends UiC<{
    className?: string;
}, {}> {
    performRender(): JSX.Element;
}
