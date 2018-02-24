import * as React from "react";
import IErrorReporter from "../config/IErrorReporter";
import { runtime } from "./SrApp";
import StrontiumAppConfig from "../config/StrontiumAppConfig";
import ConfigElementTypes from "../config/ConfigElementTypes";

export interface IStrontiumAppProps {
    environment?: string,
    errorReporter?: IErrorReporter,
    onPreInit?: () => void,
    onPostInit?: () => void
}

export default class StrontiumApp extends React.Component<IStrontiumAppProps, {}> {
    private _awaitingConfigTypes: { [key: string]: boolean } = {};
    private _configuredTypes: { [key: string]: any } = {};
    private _configTimeoutHandler: number = null;

    render(): React.ReactNode {
        return React.Children.map(this.props.children, (child, index) => {
            if (this.registerValidChild(child)) {
                return React.cloneElement(child as React.ReactElement<any>,
                    {
                        configure: (type: ConfigElementTypes, config: any) => { this.onConfigElementCallback(type, config); },
                        ...(child as React.ReactElement<any>).props
                    });
            }
            return null;
        });
    }

    registerValidChild(child): boolean {
        if (React.isValidElement(child)) {
            let props = child.props;
            let type = props['srConfigElementType'] as ConfigElementTypes;
            if (typeof type !== 'undefined') {
                this._awaitingConfigTypes[ConfigElementTypes[type]] = false;
                return true;
            }
        }

        return false;
    }

    onConfigElementCallback(type: ConfigElementTypes, config: any) {
        let typeName = ConfigElementTypes[type];
        if (this._awaitingConfigTypes[typeName]) {
            return;
        }

        this._awaitingConfigTypes[typeName] = true;
        this._configuredTypes[typeName] = config;

        if (this._configTimeoutHandler) {
            window.clearTimeout(this._configTimeoutHandler);
        }

        if (!this.awaitingAnyTypes()) {
            this.finalizeConfiguration();
        } else {
            this._configTimeoutHandler = window.setTimeout(() => {
                this.configTimedOut();
            }, 1000);
        }
    }

    awaitingAnyTypes(): boolean {
        return Object.keys(this._awaitingConfigTypes).map((k) => { return this._awaitingConfigTypes[k]; }).filter((v) => { return !v; }).length > 0;
    }

    finalizeConfiguration() {
        let cfg = new StrontiumAppConfig(
            this.props.environment,
            this.getConfiguredType(ConfigElementTypes.Logger),
            this.props.errorReporter,
            this.getConfiguredType(ConfigElementTypes.Api),
            this.getConfiguredType(ConfigElementTypes.Ui),
            this.props.onPreInit,
            this.props.onPostInit);
        runtime.initialize(cfg);
    }

    getConfiguredType(type: ConfigElementTypes): any {
        return this._configuredTypes[ConfigElementTypes[type]];
    }

    configTimedOut() {
        console.warn("Configuration responses timed out.  Please review your configuration setup inside your StroniumApp (or derived) element.  Proceeding with finalization.");
        this.finalizeConfiguration();
    }
}