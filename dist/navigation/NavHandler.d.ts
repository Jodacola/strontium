/// <reference types="react" />
import NavHandlerBase from "./NavHandlerBase";
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
export default class NavHandler extends NavHandlerBase {
    route: string;
    title: string;
    builder: (data: NavigationTarget, routeValues: any) => JSX.Element;
    constructor(route: string, title: string, builder: (data: NavigationTarget, routeValues: any) => JSX.Element);
    typeIdentifier(): string;
    dataIdentifier(data: NavigationTarget): string;
    buildElement(data: NavigationTarget): JSX.Element;
    getTitle(data: NavigationTarget): string;
    getMatchPattern(): IMatchItem[];
}
