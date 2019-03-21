/// <reference types="react" />
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import { INavigationHandler } from "./Navigation";
export default class NavHandler implements INavigationHandler {
    route: string;
    title: string;
    builder: (data: NavigationTarget, routeValues: any) => JSX.Element;
    private matches;
    constructor(route: string, title: string, builder: (data: NavigationTarget, routeValues: any) => JSX.Element);
    typeIdentifier(): string;
    dataIdentifier(data: NavigationTarget): string;
    buildElement(data: NavigationTarget): JSX.Element;
    getTitle(): string;
    getMatchPattern(): IMatchItem[];
    matchPattern(): IMatchItem[];
    handlesType(data: NavigationTarget): boolean;
}
