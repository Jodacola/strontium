import NavHandlerBase from "./NavHandlerBase";
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import * as React from "react";

export default class NavHandler extends NavHandlerBase {
    constructor(public route: string, public title: string, public builder: (data: NavigationTarget, routeValues: any) => JSX.Element) {
        super();
    }

    public typeIdentifier(): string {
        return this.title;
    }

    public dataIdentifier(data: NavigationTarget): string {
        return data.paths.join(":");
    }

    public buildElement(data: NavigationTarget): JSX.Element {
        return this.builder(data, data.parsed);
    }

    public getTitle(data: NavigationTarget): string {
        return this.title;
    }

    public getMatchPattern(): IMatchItem[] {
        return this.parseMatches(this.route);
    }
}
