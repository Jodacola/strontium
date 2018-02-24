/// <reference types="react" />
import * as React from "react";
import NavigationTarget from "../navigation/NavigationTarget";
export interface IRouteConfig {
    route: string;
    title?: string;
    view: (data: NavigationTarget, parsed: any) => JSX.Element;
}
export default class RouteConfig extends React.Component<IRouteConfig, {}> {
    render(): any;
}
