import NavigationTarget from "../../lib/navigation/NavigationTarget";

describe('NavigationTarget', () => {
    it('constructs the target', () => {
        const nav = new NavigationTarget('/app/path1//path2/   /value3?queryKey=queryValue#!', { key: 'value' }, 'app');
        expect(nav.original).toBe('/app/path1//path2/   /value3?queryKey=queryValue#!');
        expect(nav.parsed).toBeDefined();
        expect(Object.keys(nav.parsed).length).toBe(0);
        expect(nav.data).toBeDefined()
        expect(nav.data.key).toBe('value');
        expect(nav.paths.length).toBe(3);
        expect(nav.paths[0]).toBe('path1');
        expect(nav.paths[1]).toBe('path2');
        expect(nav.paths[2]).toBe('value3');
        expect(nav.query).toBeDefined();
        expect(nav.query.queryKey).toBe('queryValue');
    });

    it('returns the correct identifier', () => {
        const nav = new NavigationTarget('/app/path1//path2/   /value3?queryKey=queryValue#!', { key: 'value' }, 'app');
        expect(nav.dataIdentifier()).toBe('path1:path2:value3');
    });
});