import * as React from "react";
import UiC from "./SrUiComponent";
import Title from "./Title";
import Clear from "./Clear";

export default class TitleSection extends UiC<{ className?: string, titleClassName?: string, titleContent?: any }, {}> {
    performRender() {
        return (
            <div className="title-section">
                <div className="col-sm-6 title-col">
                    <Title className={this.props.titleClassName}>{this.props.titleContent}</Title>
                </div>
                <div className="col-sm-6 content-col">
                    {this.props.children}
                </div>
                <Clear />
            </div>);
    }
}
