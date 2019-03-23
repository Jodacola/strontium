import { parseMatches } from "./NavHandlerUtils";
import { sortedAndFilledPattern, navTargetMatchesPattern, parsePathValues } from "./NavHandlerUtils";
export default class NavHandler {
    constructor(route, title, builder) {
        this._matches = null;
        this._route = route;
        this._title = title;
        this._builder = builder;
    }
    typeIdentifier() {
        return this._title;
    }
    buildElement(data) {
        return this._builder(data, data.parsed);
    }
    getTitle() {
        return this._title;
    }
    matchPattern() {
        if (this._matches === null) {
            this._matches = sortedAndFilledPattern(parseMatches(this._route));
        }
        return this._matches;
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