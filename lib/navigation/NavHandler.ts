import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import { parseMatches } from "./NavHandlerUtils";
import { sortedAndFilledPattern, navTargetMatchesPattern, parsePathValues } from "./NavHandlerUtils";
import INavigationHandler from "./INavigationHandler";

export default class NavHandler implements INavigationHandler {
    private _matches: IMatchItem[] = null!;
    private _route: string;
    private _title: string;
    private _builder: (data: NavigationTarget, routeValues: any) => JSX.Element;

    constructor(route: string, title: string, builder: (data: NavigationTarget, routeValues: any) => JSX.Element) {
        this._route = route;
        this._title = title;
        this._builder = builder;
    }

    public typeIdentifier(): string {
        return this._title;
    }

    public buildElement(data: NavigationTarget): JSX.Element {
        return this._builder(data, data.parsed);
    }

    public getTitle(): string {
        return this._title;
    }

    public matchPattern(): IMatchItem[] {
        if (this._matches === null) {
            this._matches = sortedAndFilledPattern(parseMatches(this._route));
        }

        return this._matches;
    }

    public handlesType(data: NavigationTarget): boolean {
        const pattern = this.matchPattern();

        if (navTargetMatchesPattern(data, pattern)) {
            data.parsed = parsePathValues(data, pattern);
            return true;
        }

        return false;
    }
}
