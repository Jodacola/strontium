import MatchByTypes from "./MatchByTypes";
import Log from "../framework/Log";
class NavigationHandlerBase {
    constructor() {
        this.matches = null;
    }
    matchPattern() {
        if (this.matches === null) {
            var newMatches = this.getMatchPattern();
            newMatches = newMatches.sort((a, b) => { return a.position - b.position; });
            var finalMatches = [];
            var lastIndex = -1;
            newMatches.forEach((m) => {
                if (m.position !== lastIndex + 1) {
                    finalMatches.push(this.present(lastIndex + 1));
                }
                finalMatches.push(m);
                lastIndex = m.position;
            });
            this.matches = finalMatches;
        }
        return this.matches;
    }
    maxPatternIndex(withOptionals = true) {
        if (this.matchPattern().length === 0) {
            return -1;
        }
        if (!withOptionals) {
            return this.matchPattern().filter((p) => {
                return p.matchBy !== MatchByTypes.Optional;
            }).reduce((a, b) => {
                return (a.position > b.position ? a : b);
            }).position;
        }
        return this.matchPattern().reduce((a, b) => {
            return (a.position > b.position ? a : b);
        }).position;
    }
    handlesType(data) {
        if (!this.checkLengths(data)) {
            return false;
        }
        var pattern = this.matchPattern();
        var match = true;
        var parsed = {};
        pattern.forEach((v) => {
            if (match && !this.compareMatch(data.paths[v.position], v)) {
                match = false;
            }
            else {
                parsed[v.value] = this.parsedValue(data.paths[v.position], v);
            }
        });
        if (match) {
            data.parsed = parsed;
        }
        return match;
    }
    checkLengths(data) {
        var maxIndex = this.maxPatternIndex();
        var maxNoOptionals = this.maxPatternIndex(false);
        if (data.paths.length - 1 === maxIndex || data.paths.length - 1 === maxNoOptionals) {
            return true;
        }
        return false;
    }
    compareMatch(path, match) {
        if (match.parseFormat === 'int' && isNaN(parseInt(path))) {
            return false;
        }
        if (match.matchBy === MatchByTypes.Present && (path || "").trim().length > 0) {
            return true;
        }
        if (match.matchBy === MatchByTypes.Exact && path === match.value) {
            return true;
        }
        if (match.matchBy === MatchByTypes.Optional) {
            return true;
        }
        return false;
    }
    parsedValue(value, match) {
        Log.d(this, "Parsing matched route value", { value: value, match: match });
        if (match.parseFormat === "int") {
            return parseInt(value);
        }
        return value;
    }
    /* Allows a path to be parsed for building matches.
     * For example:
     *   teams/:teamId/users/:userId/?selection
     * Would be parsed out and built with the following items:
     *   exact(0, "teams")
     *   present(1, "teamId")
     *   exact(2, "users")
     *   present(3, "userId")
     *   optional(4, "selection")
     * A match of the following:
     *   teams/12/users/28
     * Would result in the following parsed data inside a NavigationTarget#parsed property:
     *   {"teams": "teams", "teamId": 17, "users": "users", "userId": 28, "selection": null}
     * Allowing for one to use the data like so, in a navigation handler's buildElement invocation:
     *   return <p>{data.parsed.teamId}</p>;
     * */
    parseMatches(format) {
        var parts = format.split('/').filter((v) => v.length > 0);
        return parts.map((v, i) => {
            return this.parseMatch(v, i);
        });
    }
    parseMatch(item, index) {
        if (item.startsWith(":")) {
            let id = item.substr(1);
            let fmt = null;
            if (id.startsWith("[int]")) {
                fmt = "int";
                id = id.substr(5);
            }
            return this.present(index, id, fmt);
        }
        else if (item.startsWith("?")) {
            let id = item.substr(1);
            let fmt = null;
            if (id.startsWith("[int]")) {
                fmt = "int";
                id = id.substr(5);
            }
            return this.optional(index, id, fmt);
        }
        else {
            return this.exact(index, item);
        }
    }
    exact(position, value, format = null) {
        return this.newMatch(position, MatchByTypes.Exact, value, format);
    }
    present(position, value = null, format = null) {
        return this.newMatch(position, MatchByTypes.Present, value, format);
    }
    optional(position, value = null, format = null) {
        return this.newMatch(position, MatchByTypes.Optional, value, format);
    }
    newMatch(position, type, value = null, format = null) {
        return { position: position, matchBy: type, value: value, parseFormat: format };
    }
}
export default NavigationHandlerBase;
//# sourceMappingURL=NavHandlerBase.js.map