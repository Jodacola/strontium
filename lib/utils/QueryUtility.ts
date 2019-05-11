import { runtime } from "../framework/SrApp";

export const currentQuery = (retAsObj: boolean = false): string | any => {
    let queryString = window.location.search || '';
    if (!retAsObj) {
        return queryString;
    } else {
        return asObject(queryString);
    }
};

export const asObject = (queryString: string): { [key: string]: any } => {
    let obj: { [key: string]: any } = {};
    queryString = stripDelimiter(queryString || '');
    let components = queryString.split('&');
    components.forEach(c => {
        let split = c.split('=');
        obj[split[0]] = split[1];
    });
    return obj;
};

export const buildQuery = (obj: object, exclusive: boolean = false): string => {
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
            finalParts.push(`${k}=${encodeURIComponent(value.toString())}`);
        }
    });

    return finalParts.join('&');
};

export const stripDelimiter = (queryString: string): string => {
    if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1);
    }

    return queryString;
};

export const updateQuery = (query: string): void => {
    runtime.ui.updateQuery(query);
};