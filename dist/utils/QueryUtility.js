import { runtime } from "../framework/SrApp";
export const currentQuery = (retAsObj = false) => {
    let queryString = window.location.search || '';
    if (!retAsObj) {
        return queryString;
    }
    else {
        return asObject(queryString);
    }
};
export const asObject = (queryString) => {
    let obj = {};
    queryString = stripDelimiter(queryString || '');
    let components = queryString.split('&');
    components.forEach(c => {
        if (c.trim().length > 0) {
            let split = c.split('=');
            obj[split[0]] = decodeURIComponent(split[1]);
        }
    });
    return obj;
};
export const buildQuery = (obj, exclusive = false, encodeComponents = true) => {
    let current = currentQuery(true);
    if (exclusive) {
        current = {};
    }
    obj = obj || {};
    Object.keys(obj).forEach(k => current[k] = obj[k]);
    let finalParts = [];
    Object.keys(current).forEach(k => {
        let value = current[k];
        if (value) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            let component = value.toString();
            if (encodeComponents) {
                component = encodeURIComponent(component);
            }
            finalParts.push(`${k}=${component}`);
        }
    });
    return finalParts.join('&');
};
export const stripDelimiter = (queryString) => {
    if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1);
    }
    return queryString;
};
export const updateQuery = (query) => {
    runtime.ui.updateQuery(query);
};
//# sourceMappingURL=QueryUtility.js.map