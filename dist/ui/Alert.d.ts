/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class Alert extends UiC<{
    type?: string;
    classes?: string;
}, {}> {
    performRender(): JSX.Element;
}
