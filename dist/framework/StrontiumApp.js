import * as React from "react";
import { runtime } from "./SrApp";
import StrontiumAppConfig from "../config/StrontiumAppConfig";
import ConfigElementTypes from "../config/ConfigElementTypes";
export default class StrontiumApp extends React.Component {
    constructor() {
        super(...arguments);
        this._awaitingConfigTypes = {};
        this._configuredTypes = {};
        this._configTimeoutHandler = null;
    }
    render() {
        return React.Children.map(this.props.children, (child, index) => {
            if (this.registerValidChild(child)) {
                return React.cloneElement(child, Object.assign({ configure: (type, config) => { this.onConfigElementCallback(type, config); } }, child.props));
            }
            return null;
        });
    }
    registerValidChild(child) {
        if (React.isValidElement(child)) {
            let props = child.props;
            let type = props['srConfigElementType'];
            if (typeof type !== 'undefined') {
                if (!this._awaitingConfigTypes[ConfigElementTypes[type]]) {
                    this._awaitingConfigTypes[ConfigElementTypes[type]] = 1;
                }
                else {
                    this._awaitingConfigTypes[ConfigElementTypes[type]]++;
                }
                return true;
            }
        }
        return false;
    }
    onConfigElementCallback(type, config) {
        let typeName = ConfigElementTypes[type];
        if (this._awaitingConfigTypes[typeName] === 0) {
            return;
        }
        this._awaitingConfigTypes[typeName]--;
        if (type === ConfigElementTypes.Api) {
            if (!this._configuredTypes[typeName]) {
                this._configuredTypes[typeName] = [];
            }
            this._configuredTypes[typeName].push(config);
        }
        else {
            this._configuredTypes[typeName] = config;
        }
        if (this._configTimeoutHandler) {
            window.clearTimeout(this._configTimeoutHandler);
        }
        if (!this.awaitingAnyTypes()) {
            this.finalizeConfiguration();
        }
        else {
            this._configTimeoutHandler = window.setTimeout(() => {
                this.configTimedOut();
            }, 1000);
        }
    }
    awaitingAnyTypes() {
        return Object.keys(this._awaitingConfigTypes).map((k) => {
            return this._awaitingConfigTypes[k];
        }).filter((v) => {
            return v !== 0;
        }).length > 0;
    }
    finalizeConfiguration() {
        let cfg = new StrontiumAppConfig({
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
    getConfiguredType(type) {
        return this._configuredTypes[ConfigElementTypes[type]];
    }
    configTimedOut() {
        console.warn("Configuration responses timed out.  Please review your configuration setup inside your StroniumApp (or derived) element.  Proceeding with finalization.");
        this.finalizeConfiguration();
    }
}
//# sourceMappingURL=StrontiumApp.js.map