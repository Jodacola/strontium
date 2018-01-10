/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class TitleSection extends UiC<{
    className?: string;
    titleClassName?: string;
    titleContent?: any;
}, {}> {
    performRender(): JSX.Element;
}
