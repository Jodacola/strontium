export default class NavigationTarget {
    constructor(original: string, data: any){
        this.original = original;
        this.data = data;
    }
    paths: string[] = [];
    query: { [key: string]: string } = {};
    original: string;
    data: any;
    parsed: any = {};
}
