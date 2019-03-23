export default class NavigationTarget {
    constructor(original: string, data: any, basePath: string);
    paths: string[];
    query: {
        [key: string]: string;
    };
    original: string;
    data: any;
    parsed: any;
    basePath: string;
    dataIdentifier(): string;
    private populate;
}
