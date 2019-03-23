import IMatchItem from "./IMatchItem";
import MatchByTypes from "./MatchByTypes";
import NavigationTarget from "./NavigationTarget";
export declare function parseMatches(format: string): IMatchItem[];
export declare function parseMatch(item: string, index: number): IMatchItem;
export declare function exactMatch(position: number, value: string, format?: string): IMatchItem;
export declare function presentMatch(position: number, value?: string, format?: string): IMatchItem;
export declare function optionalMatch(position: number, value?: string, format?: string): IMatchItem;
export declare function newMatch(position: number, type: MatchByTypes, value?: string, format?: string): IMatchItem;
export declare function compareMatch(segment: string, match: IMatchItem): boolean;
export declare function checkNumericMatch(segment: string, match: IMatchItem): boolean;
export declare function sortedAndFilledPattern(newMatches: IMatchItem[]): IMatchItem[];
export declare function parsedPath(value: string, match: IMatchItem): any;
export declare function cleanPath(path: string, basePath: string): string;
export declare function splitPathAndQuery(path: string): {
    path: string;
    query: string;
};
export declare function navTargetMatchesPattern(target: NavigationTarget, pattern: IMatchItem[]): boolean;
export declare function parsePathValues(target: NavigationTarget, pattern: IMatchItem[]): {
    [key: string]: any;
};
export declare function dataFitsPattern(target: NavigationTarget, pattern: IMatchItem[]): boolean;
export declare function maxPatternIndex(pattern: IMatchItem[], withOptionals?: boolean): number;
export declare function maxPatternReduce(a: IMatchItem, b: IMatchItem): IMatchItem;
