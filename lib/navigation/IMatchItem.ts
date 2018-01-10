import MatchByTypes from "./MatchByTypes";

interface IMatchItem {
    position: number;
    matchBy: MatchByTypes;
    value: string;
    parseFormat?: string;
}

export default IMatchItem;