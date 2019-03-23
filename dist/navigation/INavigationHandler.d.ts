/// <reference types="react" />
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
export default interface INavigationHandler {
    handlesType(data: NavigationTarget): boolean;
    matchPattern(): IMatchItem[];
    typeIdentifier(): string;
    buildElement(data: NavigationTarget): JSX.Element;
    getTitle(data: NavigationTarget): string;
}
