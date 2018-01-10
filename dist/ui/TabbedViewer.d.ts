/// <reference types="react" />
import UiC from "./SrUiComponent";
import ITabConfig from "./ITabConfig";
export default class TabbedViewer extends UiC<{
    tabSelected: (id: string) => void;
    tabs: ITabConfig[];
    currentSelection: string;
    className?: string;
}, {}> {
    onComponentMounted(): void;
    onNewProps(props: {
        tabSelected: (id: string) => void;
        tabs: ITabConfig[];
        currentSelection: string;
        className?: string;
    }): void;
    checkValidTab(id?: string): void;
    performRender(): JSX.Element;
    validId(id: string): boolean;
    isId(id: any): boolean;
    tabElement(tab: ITabConfig, index: number): JSX.Element;
    tabSelected(id: string): void;
    tabContent(): JSX.Element;
}
