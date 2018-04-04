export default class QueryUtility {
    static current(asObject?: boolean): string | any;
    static asObject(queryString: string): any;
    static buildQuery(obj: object, exclusive?: boolean): string;
    static stripDelimiter(queryString: string): string;
}
