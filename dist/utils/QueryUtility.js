import { runtime } from "../framework/SrApp";
export default class QueryUtility {
    static current(asObject = false) {
        let queryString = window.location.search || '';
        if (!asObject) {
            return queryString;
        }
        else {
            return this.asObject(queryString);
        }
    }
    static asObject(queryString) {
        let obj = {};
        queryString = this.stripDelimiter(queryString || '');
        let components = queryString.split('&');
        components.forEach(c => {
            let split = c.split('=');
            obj[split[0]] = split[1];
        });
        return obj;
    }
    static buildQuery(obj, exclusive = false) {
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
    static stripDelimiter(queryString) {
        if (queryString.indexOf('?') === 0) {
            queryString = queryString.substr(1);
        }
        return queryString;
    }
}
export function updateQuery(query) {
    runtime.ui.updateQuery(query);
}
//# sourceMappingURL=QueryUtility.js.map