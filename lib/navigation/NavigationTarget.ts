import Log from "../framework/Log";
import { cleanPath, splitPathAndQuery } from "./NavHandlerUtils";
import QueryUtility from "../utils/QueryUtility";

export default class NavigationTarget {
    constructor(original: string, data: any, basePath: string) {
        this.original = original;
        this.data = data;
        this.basePath = basePath;
        this.populate();
    }

    paths: string[] = [];
    query: { [key: string]: string } = {};
    original: string;
    data: any;
    parsed: any = {};
    basePath: string;

    public dataIdentifier(): string {
        return this.paths.join(":");
    }

    private populate() {
        const originalPath = cleanPath(this.original, this.basePath);
        Log.d(this, "Navigation target location", { path: originalPath });
        const { path, query } = splitPathAndQuery(originalPath);
        const targets: string[] = path.split("/").filter((s) => { return ((s || "").trim().length > 0); });
        this.paths = targets;
        this.query = QueryUtility.asObject(query);
    }
}
