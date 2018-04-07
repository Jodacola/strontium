import UiC from "./SrUiComponent";
import Log from "../framework/Log";
import { Popover as BsPopover, OverlayTrigger } from "react-bootstrap";
import { runtime } from "../framework/SrApp";
import * as React from "react";

export interface IPopoverProps {
    id: string,
    title?: string,
    content: JSX.Element,
    placement?: 'top' | 'bottom' | 'left' | 'right',
    preventOverlay?: boolean,
    rootClose?: boolean,
    container?: any
};

export default class Popover extends UiC<IPopoverProps, {}> {
    performRender() {
        try {
            var popover = (
                <BsPopover id={this.props.id} title={this.props.title}>
                    {this.props.content}
                </BsPopover>
            );
            return (
                <OverlayTrigger
                    trigger="click"
                    containerPadding={10}
                    rootClose={this.props.rootClose !== false}
                    onEntering={() => { this.overlayEntering(); }}
                    onExiting={() => { this.overlayExiting(); }}
                    overlay={popover}
                    container={this.props.container}
                    placement={this.props.placement || "bottom"}>
                    {this.props.children}
                </OverlayTrigger>
            );
        } catch (exc) {
            Log.e(this, 'Unable to create react-bootstrap modal. Please check your bundler config or included libraries.', { exception: exc });
            return null;
        }
    }

    overlayEntering() {
        if (!this.props.preventOverlay) {
            runtime.ui.showOverlay();
        }
    }

    overlayExiting() {
        if (!this.props.preventOverlay) {
            runtime.ui.hideOverlay();
        }
    }
}