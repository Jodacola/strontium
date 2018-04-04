import UiC from "./SrUiComponent";
export interface IAnimationProps {
    in: boolean;
    appear?: boolean;
    leave?: boolean;
    enter?: boolean;
    step?: number;
    direction?: string;
    nonSteppedClass?: boolean;
}
export default class Animated extends UiC<IAnimationProps, {}> {
    performRender(): {};
    className(): string;
}
