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
                this._awaitingConfigTypes[ConfigElementTypes[type]] = false;
                return true;
            }
        }
        return false;
    }
    onConfigElementCallback(type, config) {
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
        }
        else {
            this._configTimeoutHandler = window.setTimeout(() => {
                this.configTimedOut();
            }, 1000);
        }
    }
    awaitingAnyTypes() {
        return Object.keys(this._awaitingConfigTypes).map((k) => { return this._awaitingConfigTypes[k]; }).filter((v) => { return !v; }).length > 0;
    }
    finalizeConfiguration() {
        let cfg = new StrontiumAppConfig(this.props.environment, this.getConfiguredType(ConfigElementTypes.Logger), this.props.errorReporter, this.getConfiguredType(ConfigElementTypes.Api), this.getConfiguredType(ConfigElementTypes.Ui), this.props.onPreInit, this.props.onPostInit);
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