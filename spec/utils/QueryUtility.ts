import QueryUtility from '../../lib/utils/QueryUtility';

describe('QueryUtility', () => {
    it('returns current query string in string form', () => {
        let expected = "?id=someId&key1=value1&key2=value2";
        let current = QueryUtility.current();
        expect(current).toBe(expected);
    });

    it('returns current query string in object form', () => {
        let current = QueryUtility.current(true);
        expect(typeof current).toBe('object');
        expect(current.id).toBe('someId');
        expect(current.key1).toBe('value1');
        expect(current.key2).toBe('value2');
    });

    it('builds object from supplied query string', () => {
        let current = QueryUtility.asObject('?id=newId&key1=newValue1&key2=newValue2');
        expect(typeof current).toBe('object');
        expect(current.id).toBe('newId');
        expect(current.key1).toBe('newValue1');
        expect(current.key2).toBe('newValue2');
    });

    it('strips the ? from supplied query string', () => {
        let current = QueryUtility.stripDelimiter('?id=newId&key1=newValue1&key2=newValue2');
        expect(current).toBe('id=newId&key1=newValue1&key2=newValue2');
        current = QueryUtility.stripDelimiter(current);
        expect(current).toBe('id=newId&key1=newValue1&key2=newValue2');
    });

    it('builds an inclusive new query string from object', () => {
        let newQuery = QueryUtility.buildQuery({ key3: 'value3', key4: 'value4', key1: 'newValue1', encKey: '{"someValue":"meat & potatoes!?"}' });
        expect(newQuery.indexOf('key3=value3')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('key4=value4')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('key1=newValue1')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('key2=value2')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('id=someId')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('encKey=%7B%22someValue%22%3A%22meat%20%26%20potatoes!%3F%22%7D')).toBeGreaterThan(-1);
        let parsed = QueryUtility.asObject(newQuery);
        expect(parsed.encKey).toBeDefined();
        expect(parsed.id).toBeDefined();
        expect(parsed.key1).toBeDefined();
        expect(parsed.key2).toBeDefined();
        expect(parsed.key3).toBeDefined();
        expect(parsed.key4).toBeDefined();
    });

    it('builds an exclusive new query string from object', () => {
        let newQuery = QueryUtility.buildQuery({ key3: 'value3', key4: 'value4' }, true);
        expect(newQuery.indexOf('key3=value3')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('key4=value4')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('key1=value1')).toEqual(-1);
        expect(newQuery.indexOf('key2=value2')).toEqual(-1);
        expect(newQuery.indexOf('id=someId')).toEqual(-1);
    });

    it('builds a new query string by stringifying objects', () => {
        let newQuery = QueryUtility.buildQuery({ jsonKey: { key: 'value' }, arrayKey: [1, 2, 3, 4, 5] });
        expect(newQuery.indexOf('jsonKey=%7B%22key%22%3A%22value%22%7D')).toBeGreaterThan(-1);
        expect(newQuery.indexOf('arrayKey=%5B1%2C2%2C3%2C4%2C5%5D')).toBeGreaterThan(-1);
    });
});
