export default class NavigationTarget {
    paths: string[];
    query: {
        [key: string]: string;
    };
    original: string;
    data: any;
    parsed: any;
}
