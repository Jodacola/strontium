import MatchByTypes from "./MatchByTypes";

export default interface IMatchItem {
    position: number;
    matchBy: MatchByTypes;
    value: string;
    parseFormat?: string;
}
