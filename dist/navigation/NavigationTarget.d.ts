export default class NavigationTarget {
    constructor(original: string, data: any);
    paths: string[];
    query: {
        [key: string]: string;
    };
    original: string;
    data: any;
    parsed: any;
}
