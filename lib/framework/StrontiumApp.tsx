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
    private _awaitingConfigTypes: { [key: string]: number } = {};
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
                if (!this._awaitingConfigTypes[ConfigElementTypes[type]]) {
                    this._awaitingConfigTypes[ConfigElementTypes[type]] = 1;
                } else {
                    this._awaitingConfigTypes[ConfigElementTypes[type]]++;
                }
                return true;
            }
        }

        return false;
    }

    onConfigElementCallback(type: ConfigElementTypes, config: any) {
        let typeName = ConfigElementTypes[type];
        if (this._awaitingConfigTypes[typeName] === 0) {
            return;
        }

        this._awaitingConfigTypes[typeName]--;
        if (type === ConfigElementTypes.Api) {
            if (!this._configuredTypes[typeName]) {
                this._configuredTypes[typeName] = []
            }
            this._configuredTypes[typeName].push(config);
        } else {
            this._configuredTypes[typeName] = config;
        }

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
        return Object.keys(this._awaitingConfigTypes).map((k) => {
            return this._awaitingConfigTypes[k];
        }).filter((v) => {
            return v !== 0;
        }).length > 0;
    }

    finalizeConfiguration() {
        let cfg = new StrontiumAppConfig(
            {
                environment: this.props.environment,
                logConfig: this.getConfiguredType(ConfigElementTypes.Logger),
                errorReporter: this.props.errorReporter,
                apiConnections: this.getConfiguredType(ConfigElementTypes.Api),
                uiInitializer: this.getConfiguredType(ConfigElementTypes.Ui),
                services: this.getConfiguredType(ConfigElementTypes.Services),
                preInit: this.props.onPreInit,
                postInit: this.props.onPostInit
            });
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