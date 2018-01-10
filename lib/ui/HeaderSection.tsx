import * as React from "react";
import UiC from "./SrUiComponent";
import Header from "./Header";
import Clear from "./Clear";

export default class HeaderSection extends UiC<{ className?: string, headerClassName?: string, headerContent?: any }, {}> {
    performRender() {
        return (
            <div className={this.classes("header-section", this.props.className)}>
                <div className="col-sm-6 header-col">
                    <Header className={this.props.headerClassName}>{this.props.headerContent}</Header>
                </div>
                <div className="col-sm-6 content-col">
                    {this.props.children}
                </div>
                <Clear />
            </div>);
    }
}
