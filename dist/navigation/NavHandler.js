import NavHandlerBase from "./NavHandlerBase";
export default class NavHandler extends NavHandlerBase {
    constructor(route, title, builder) {
        super();
        this.route = route;
        this.title = title;
        this.builder = builder;
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
    getTitle(data) {
        return this.title;
    }
    getMatchPattern() {
        return this.parseMatches(this.route);
    }
}
//# sourceMappingURL=NavHandler.js.map