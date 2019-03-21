import { parseMatches } from "./NavHandlerUtils";
import { sortedAndFilledPattern, navTargetMatchesPattern, parsePathValues } from "./NavHandlerUtils";
export default class NavHandler {
    constructor(route, title, builder) {
        this.route = route;
        this.title = title;
        this.builder = builder;
        this.matches = null;
    }
    typeIdentifier() {
        return this.title;
    }
    dataIdentifier(data) {
        return data.paths.join(":");
    }
    buildElement(data) {
        return this.builder(data, data.parsed);
    }
    getTitle() {
        return this.title;
    }
    getMatchPattern() {
        return parseMatches(this.route);
    }
    matchPattern() {
        if (this.matches === null) {
            this.matches = sortedAndFilledPattern(this.getMatchPattern());
        }
        return this.matches;
    }
    handlesType(data) {
        const pattern = this.matchPattern();
        if (navTargetMatchesPattern(data, pattern)) {
            data.parsed = parsePathValues(data, pattern);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=NavHandler.js.map