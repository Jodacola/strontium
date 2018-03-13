import INavigationHandler from "./INavigationHandler";
import NavigationTarget from "./NavigationTarget";
import IMatchItem from "./IMatchItem";
import MatchByTypes from "./MatchByTypes";
import Log from "../framework/Log";

abstract class NavigationHandlerBase implements INavigationHandler {
    abstract typeIdentifier(): string;
    abstract dataIdentifier(data: NavigationTarget): string;
    abstract buildElement(data: NavigationTarget): JSX.Element;
    abstract getTitle(data: NavigationTarget): string;
    abstract getMatchPattern(): IMatchItem[];

    private matches: IMatchItem[] = null;

    matchPattern(): IMatchItem[] {
        if (this.matches === null) {
            var newMatches = this.getMatchPattern();
            newMatches = newMatches.sort((a, b) => { return a.position - b.position });
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

    private maxPatternIndex(withOptionals: boolean = true): number {
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

    handlesType(data: NavigationTarget): boolean {
        if (!this.checkLengths(data)) {
            return false;
        }

        var pattern = this.matchPattern();
        var match = true;
        var parsed: any = {};
        pattern.forEach((v) => {
            if (match && !this.compareMatch(data.paths[v.position], v)) {
                match = false;
            } else {
                parsed[v.value] = this.parsedValue(data.paths[v.position], v);
            }
        });

        if (match) {
            data.parsed = parsed;
        }

        return match;
    }

    private checkLengths(data: NavigationTarget): boolean {
        var maxIndex = this.maxPatternIndex();
        var maxNoOptionals = this.maxPatternIndex(false);

        if (data.paths.length - 1 === maxIndex || data.paths.length - 1 === maxNoOptionals) {
            return true;
        }

        return false;
    }

    private compareMatch(path: string, match: IMatchItem): boolean {
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

    private parsedValue(value: string, match: IMatchItem): any {
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
    protected parseMatches(format: string): IMatchItem[] {
        var parts: string[] = format.split('/').filter((v) => v.length > 0);
        return parts.map((v: string, i: number) => {
            return this.parseMatch(v, i);
        });
    }

    protected parseMatch(item: string, index: number): IMatchItem {
        if (item.startsWith(":")) {
            let id: string = item.substr(1);
            let fmt: string = null;
            if (id.startsWith("[int]")) {
                fmt = "int";
                id = id.substr(5);
            }
            return this.present(index, id, fmt);
        } else if (item.startsWith("?")) {
            let id: string = item.substr(1);
            let fmt: string = null;
            if (id.startsWith("[int]")) {
                fmt = "int";
                id = id.substr(5);
            }
            return this.optional(index, id, fmt);
        } else {
            return this.exact(index, item);
        }
    }

    protected exact(position: number, value: string, format: string = null): IMatchItem {
        return this.newMatch(position, MatchByTypes.Exact, value, format);
    }

    protected present(position: number, value: string = null, format: string = null): IMatchItem {
        return this.newMatch(position, MatchByTypes.Present, value, format);
    }

    protected optional(position: number, value: string = null, format: string = null): IMatchItem {
        return this.newMatch(position, MatchByTypes.Optional, value, format);
    }

    protected newMatch(position: number, type: MatchByTypes, value: string = null, format: string = null): IMatchItem {
        return { position: position, matchBy: type, value: value, parseFormat: format };
    }
}

export default NavigationHandlerBase;