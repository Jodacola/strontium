import * as React from "react";
import IErrorReporter from "../config/IErrorReporter";
import ConfigElementTypes from "../config/ConfigElementTypes";
export type IStrontiumAppProps = {
    environment?: string;
    errorReporter?: IErrorReporter;
    onPreInit?: () => void;
    onPostInit?: () => void;
} & React.PropsWithChildren;
export default class StrontiumApp extends React.Component<IStrontiumAppProps, {}> {
    private _awaitingConfigTypes;
    private _configuredTypes;
    private _configTimeoutHandler;
    render(): React.ReactNode;
    registerValidChild(child: any): boolean;
    onConfigElementCallback(type: ConfigElementTypes, config: any): void;
    awaitingAnyTypes(): boolean;
    finalizeConfiguration(): void;
    getConfiguredType(type: ConfigElementTypes): any;
    configTimedOut(): void;
}
