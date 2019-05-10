import { runtime } from "../framework/SrApp";

export default class QueryUtility {
    public static current(asObject: boolean = false): string | any {
        let queryString = window.location.search || '';
        if (!asObject) {
            return queryString;
        } else {
            return this.asObject(queryString);
        }
    }

    public static asObject(queryString: string) {
        let obj: any = {};
        queryString = this.stripDelimiter(queryString || '');
        let components = queryString.split('&');
        components.forEach(c => {
            let split = c.split('=');
            obj[split[0]] = split[1];
        });
        return obj;
    }

    public static buildQuery(obj: object, exclusive: boolean = false) {
        let currentQuery = this.current(true);

        if (exclusive) {
            currentQuery = {};
        }

        obj = obj || {};
        Object.keys(obj).forEach(k => currentQuery[k] = obj[k]);

        let finalParts = [];
        Object.keys(currentQuery).forEach(k => {
            let value = currentQuery[k];
            if (value) {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                finalParts.push(`${k}=${encodeURIComponent(value.toString())}`);
            }
        });

        return finalParts.join('&');
    }

    public static stripDelimiter(queryString: string) {
        if (queryString.indexOf('?') === 0) {
            queryString = queryString.substr(1);
        }

        return queryString;
    }
}

export function updateQuery(query: string) {
    runtime.ui.updateQuery(query);
}