export declare const currentQuery: (retAsObj?: boolean) => any;
export declare const asObject: (queryString: string) => {
    [key: string]: any;
};
export declare const buildQuery: (obj: object, exclusive?: boolean) => string;
export declare const stripDelimiter: (queryString: string) => string;
export declare const updateQuery: (query: string) => void;
