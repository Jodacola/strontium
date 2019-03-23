import Log from "../framework/Log";
import { cleanPath, splitPathAndQuery } from "./NavHandlerUtils";
import QueryUtility from "../utils/QueryUtility";
export default class NavigationTarget {
    constructor(original, data, basePath) {
        this.paths = [];
        this.query = {};
        this.parsed = {};
        this.original = original;
        this.data = data;
        this.basePath = basePath;
        this.populate();
    }
    dataIdentifier() {
        return this.paths.join(":");
    }
    populate() {
        const originalPath = cleanPath(this.original, this.basePath);
        Log.d(this, "Navigation target location", { path: originalPath });
        const { path, query } = splitPathAndQuery(originalPath);
        const targets = path.split("/").filter((s) => { return ((s || "").trim().length > 0); });
        this.paths = targets;
        this.query = QueryUtility.asObject(query);
    }
}
//# sourceMappingURL=NavigationTarget.js.map