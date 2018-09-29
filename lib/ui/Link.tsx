import * as React from "react";
import UiC from "./SrUiComponent";

export default class Link extends UiC<{ href?: string, alert?: boolean, text?: string, navTo?: string, className?: string, onClick?: (e: React.MouseEvent<any>) => void }, {}> {
    performRender() {
        return (
            <a
                href={this.props.href}
                onClick={(e) => {
                    if (this.props.onClick) {
                        this.props.onClick(e);
                    }
                    if (this.props.navTo) {
                        this.navigate(this.props.navTo);
                    }
                }}
                className={this.classes("app-link interactable", (this.props.alert ? "alert-link" : null), this.props.className)}>{this.props.text || this.props.children}</a>);
    }
}
