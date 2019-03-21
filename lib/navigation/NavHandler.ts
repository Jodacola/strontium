import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import { parseMatches } from "./NavHandlerUtils";
import { sortedAndFilledPattern, navTargetMatchesPattern, parsePathValues, dataFitsPattern } from "./NavHandlerUtils";
import { INavigationHandler } from "./Navigation";

export default class NavHandler implements INavigationHandler {
    private matches: IMatchItem[] = null;

    constructor(public route: string, public title: string, public builder: (data: NavigationTarget, routeValues: any) => JSX.Element) {
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

    public getTitle(): string {
        return this.title;
    }

    public getMatchPattern(): IMatchItem[] {
        return parseMatches(this.route);
    }

    public matchPattern(): IMatchItem[] {
        if (this.matches === null) {
            this.matches = sortedAndFilledPattern(this.getMatchPattern());
        }
        return this.matches;
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
