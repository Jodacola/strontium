/// <reference types="react" />
import UiC from "./SrUiComponent";
import LoadStates from "../api/LoadStates";
export default class LoadMask extends UiC<{
    state: LoadStates;
}, {}> {
    performRender(): JSX.Element;
}
