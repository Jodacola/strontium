/// <reference types="react" />
import INavigationHandler from "./INavigationHandler";
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import MatchByTypes from "./MatchByTypes";
declare abstract class NavigationHandlerBase implements INavigationHandler {
    abstract typeIdentifier(): string;
    abstract dataIdentifier(data: NavigationTarget): string;
    abstract buildElement(data: NavigationTarget): JSX.Element;
    abstract getTitle(data: NavigationTarget): string;
    abstract getMatchPattern(): IMatchItem[];
    private matches;
    matchPattern(): IMatchItem[];
    private maxPatternIndex;
    handlesType(data: NavigationTarget): boolean;
    private checkLengths;
    private compareMatch;
    private parsedValue;
    protected parseMatches(format: string): IMatchItem[];
    protected parseMatch(item: string, index: number): IMatchItem;
    protected exact(position: number, value: string, format?: string): IMatchItem;
    protected present(position: number, value?: string, format?: string): IMatchItem;
    protected optional(position: number, value?: string, format?: string): IMatchItem;
    protected newMatch(position: number, type: MatchByTypes, value?: string, format?: string): IMatchItem;
}
export default NavigationHandlerBase;
