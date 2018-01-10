/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class LinkButton extends UiC<{
    glyph?: string;
    label: string;
    onClick?: () => void;
}, {}> {
    performRender(): JSX.Element;
    clicked(): void;
}
