/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class HeaderSection extends UiC<{
    className?: string;
    headerClassName?: string;
    headerContent?: any;
}, {}> {
    performRender(): JSX.Element;
}
