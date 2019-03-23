/// <reference types="react" />
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import INavigationHandler from "./INavigationHandler";
export default class NavHandler implements INavigationHandler {
    private _matches;
    private _route;
    private _title;
    private _builder;
    constructor(route: string, title: string, builder: (data: NavigationTarget, routeValues: any) => JSX.Element);
    typeIdentifier(): string;
    buildElement(data: NavigationTarget): JSX.Element;
    getTitle(): string;
    matchPattern(): IMatchItem[];
    handlesType(data: NavigationTarget): boolean;
}
