import * as React from "react";
import UiC from "./SrUiComponent";
import Log from "../framework/Log";
import TransitionGroup from "react-transition-group";
export default class Animated extends UiC {
    performRender() {
        try {
            return (React.createElement(TransitionGroup.CSSTransition, { key: "animated-entry", classNames: "internal-ui", in: true, appear: this.props.appear === undefined ? true : this.props.appear, exit: this.props.leave === undefined ? true : this.props.leave, enter: this.props.enter === undefined ? true : this.props.enter, timeout: { enter: 500 + 200 * (this.props.step || 0), exit: 300 } }, this.props.children));
        }
        catch (exc) {
            Log.e(this, 'Unable to create react-transition-group animation. Please check your bundler config or included libraries.', { exception: exc });
            return null;
        }
    }
}
//# sourceMappingURL=Animated.js.map