/// <reference types="react" />
import UiC from "./SrUiComponent";
export default class Glyph extends UiC<{
    glyph: string;
    classes?: string;
}, {}> {
    performRender(): JSX.Element;
}
