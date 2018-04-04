import * as React from "react";
import UiC from "./SrUiComponent";
import Log from "../framework/Log";
import TransitionGroup from "react-transition-group";

export interface IAnimationProps {
    in: boolean,
    appear?: boolean,
    leave?: boolean,
    enter?: boolean,
    step?: number,
    direction?: string,
    nonSteppedClass?: boolean
}

export default class Animated extends UiC<IAnimationProps, {}> {
    performRender() {
        try {
            return (
                <TransitionGroup.CSSTransition
                    key="animated-entry"
                    classNames={this.className()}
                    in={true}
                    appear={this.props.appear === undefined ? true : this.props.appear}
                    exit={this.props.leave === undefined ? true : this.props.leave}
                    enter={this.props.enter === undefined ? true : this.props.enter}
                    timeout={{ enter: 500 + 200 * (this.props.step || 0), exit: 300 }}>
                    {this.props.children}
                </TransitionGroup.CSSTransition>
            );
        } catch (exc) {
            Log.e(this, 'Unable to create react-transition-group animation. Please check your bundler config or included libraries.', { exception: exc });
            return this.props.children;
        }
    }

    className(): string {
        let className = "internal-ui";
        if (this.props.nonSteppedClass !== false && this.props.step && this.props.step > 0) {
            className += `-${this.props.step}`;
        }
        return className;
    }
}
