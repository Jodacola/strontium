import * as React from "react";
import UiC from "./SrUiComponent";
import IApiLoadingState from "../api/IApiLoadingState";
import LoadStates from "../api/LoadStates";
import WaitSpinner from "./WaitSpinner";
import Alert from "./Alert";

export interface ILoadIndicatorProps {
    alertClassName?: string,
    spinClassName?: string,
    state: LoadStates,
    loadingMessage?: string,
    errorMessage?: string
}

export default class LoadIndicator extends UiC<{ alertClassName?: string, spinClassName?: string, state: LoadStates, loadingMessage?: string, errorMessage?: string }, IApiLoadingState> {
    initialState() {
        return {
            loadState: this.props.state,
            successMessage: null,
            errorMessage: this.props.errorMessage,
            loadingMessage: this.props.loadingMessage
        };
    }

    onNewProps(props: ILoadIndicatorProps): void {
        this.setState({
            loadState: props.state,
            successMessage: null,
            errorMessage: props.errorMessage,
            loadingMessage: props.loadingMessage
        });
    }

    performRender() {
        var content: JSX.Element = null;
        if (this.state.loadState === LoadStates.Succeeded && this.state.successMessage) {
            content = <Alert key="load-success" type="success" classes={this.classes("load", this.props.alertClassName)}>{this.state.successMessage}</Alert>;
        } else if (this.state.loadState === LoadStates.Failed && this.state.errorMessage) {
            content = <Alert key="load-error" type="danger" classes={this.classes("load", this.props.alertClassName)}>{this.state.errorMessage}</Alert>;
        } else if (this.state.loadState === LoadStates.Loading) {
            content = <WaitSpinner className={this.props.spinClassName} key="load-loading" message={this.state.loadingMessage} />;
        }
        return content;
    }
}
