import * as React from "react";
import IAppService from "../framework/IAppService";
export interface IServiceConfig {
    id: string;
    service: IAppService;
}
export default class RouteConfig extends React.Component<IServiceConfig, {}> {
    render(): null;
}
