import MatchByTypes from "./MatchByTypes";
import NavigationTarget from "./NavigationTarget";
import { Log } from "../lib";
import { QueryUtility } from "../utils/Utils";
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
export function parseMatches(format) {
    const parts = format.split('/').filter((v) => v.length > 0);
    return parts.map((v, i) => {
        return parseMatch(v, i);
    });
}
export function parseMatch(item, index) {
    if (item.startsWith(":")) {
        let id = item.substr(1);
        let fmt = null;
        if (id.startsWith("[int]")) {
            fmt = "int";
            id = id.substr(5);
        }
        return presentMatch(index, id, fmt);
    }
    else if (item.startsWith("?")) {
        let id = item.substr(1);
        let fmt = null;
        if (id.startsWith("[int]")) {
            fmt = "int";
            id = id.substr(5);
        }
        return optionalMatch(index, id, fmt);
    }
    else {
        return exactMatch(index, item);
    }
}
export function exactMatch(position, value, format = null) {
    return newMatch(position, MatchByTypes.Exact, value, format);
}
export function presentMatch(position, value = null, format = null) {
    return newMatch(position, MatchByTypes.Present, value, format);
}
export function optionalMatch(position, value = null, format = null) {
    return newMatch(position, MatchByTypes.Optional, value, format);
}
export function newMatch(position, type, value = null, format = null) {
    return { position: position, matchBy: type, value: value, parseFormat: format };
}
export function compareMatch(segment, match) {
    const segmentPresent = (segment || "").trim().length > 0;
    if (match.matchBy === MatchByTypes.Present && segmentPresent) {
        return checkNumericMatch(segment, match);
    }
    if (match.matchBy === MatchByTypes.Exact && segment === match.value) {
        return true;
    }
    if (match.matchBy === MatchByTypes.Optional) {
        return !segmentPresent || checkNumericMatch(segment, match);
    }
    return false;
}
export function checkNumericMatch(segment, match) {
    if (match.parseFormat === 'int' && isNaN(parseInt(segment))) {
        return false;
    }
    return true;
}
export function sortedAndFilledPattern(newMatches) {
    newMatches = newMatches.sort((a, b) => { return a.position - b.position; });
    const finalMatches = [];
    let lastIndex = -1;
    newMatches.forEach((m) => {
        if (m.position !== lastIndex + 1) {
            finalMatches.push(presentMatch(lastIndex + 1, `field${lastIndex + 1}`));
        }
        finalMatches.push(m);
        lastIndex = m.position;
    });
    return finalMatches;
}
export function parsedPath(value, match) {
    if (match.parseFormat === "int") {
        return parseInt(value);
    }
    return value;
}
export function buildNavigationTarget(originalPath, data, basePath) {
    const nav = new NavigationTarget(originalPath, data);
    originalPath = cleanPath(originalPath, basePath);
    Log.d(this, "Navigation target location", { path: originalPath });
    const { path, query } = splitPathAndQuery(originalPath);
    const targets = path.split("/").filter((s) => { return ((s || "").trim().length > 0); });
    nav.paths = targets;
    nav.query = QueryUtility.asObject(query);
    return nav;
}
export function cleanPath(path, basePath) {
    let pathSearches = [`/${basePath}/`, `/${basePath}`];
    for (const pathSearch of pathSearches) {
        if (path.indexOf(pathSearch) == 0) {
            path = path.substr(pathSearch.length);
            break;
        }
    }
    return path.replace('#!', '');
    ;
}
export function splitPathAndQuery(path) {
    const queryIdx = path.indexOf("?");
    let query = null;
    if (queryIdx !== -1) {
        query = path.substr(queryIdx + 1);
        path = path.substr(0, path.length - (path.length - queryIdx));
    }
    return { path, query };
}
export function navTargetMatchesPattern(target, pattern) {
    if (!dataFitsPattern(target, pattern)) {
        return false;
    }
    for (const item of pattern) {
        if (!compareMatch(target.paths[item.position], item)) {
            return false;
        }
    }
    return true;
}
export function parsePathValues(target, pattern) {
    return pattern.map(p => [p.value, parsedPath(target.paths[p.position], p)])
        .reduce((p, c, i) => { p[c[0]] = c[1]; return p; }, {});
}
export function dataFitsPattern(target, pattern) {
    const maxIndex = maxPatternIndex(pattern);
    const maxNoOptionals = maxPatternIndex(pattern, false);
    if (target.paths.length - 1 <= maxIndex && target.paths.length - 1 >= maxNoOptionals) {
        return true;
    }
    return false;
}
export function maxPatternIndex(pattern, withOptionals = true) {
    if (pattern.length === 0) {
        return -1;
    }
    if (!withOptionals) {
        const nonOptional = pattern.filter((p) => {
            return p.matchBy !== MatchByTypes.Optional;
        }).reduce((a, b) => {
            return (!a ? b : (a.position > b.position ? a : b));
        }, null);
        return (nonOptional ? nonOptional.position : -1);
    }
    const optional = pattern.reduce((a, b) => {
        return (!a ? b : (a.position > b.position ? a : b));
    }, null);
    return (optional ? optional.position : -1);
}
//# sourceMappingURL=NavHandlerUtils.js.map