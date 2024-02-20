/**
 * @jest-environment jsdom
 */

import { setupRuntime } from '../test_utils/UiUtils';
import { runtime, updateQuery } from '../../lib/lib';
import { currentQuery, asObject, stripDelimiter, buildQuery } from '../../lib/utils/QueryUtility';

describe('QueryUtility', () => {
    describe('currentQuery', () => {
        it('returns current query string in string form', () => {
            let expected = "?id=someId&key1=value1&key2=value2&encodedKey=Some%20Encoded%20Valu%C3%A9%3F";
            let current = currentQuery();
            expect(current).toBe(expected);
        });

        it('returns current query string in string form', () => {
            let originalLocation = window.location;
            delete (global as any).window.location;
            (global as any).window.location = {};
            let expected = "";
            let current = currentQuery();
            delete (global as any).window.location;
            (global as any).window.location = originalLocation;
            expect(current).toBe(expected);
        });

        it('returns current query string in object form', () => {
            let current = currentQuery(true);
            expect(typeof current).toBe('object');
            expect(current.id).toBe('someId');
            expect(current.key1).toBe('value1');
            expect(current.key2).toBe('value2');
        });
    });

    describe('asObject', () => {
        it('builds object from supplied query string', () => {
            let current = asObject('?id=newId&key1=newValue1&key2=newValue2&encodedKey=Some%20Encoded%20Valu%C3%A9%3F');
            expect(typeof current).toBe('object');
            expect(current.id).toBe('newId');
            expect(current.key1).toBe('newValue1');
            expect(current.key2).toBe('newValue2');
            expect(current.encodedKey).toBe('Some Encoded Valué?');
        });
    });

    describe('stripDelimiter', () => {
        it('strips the ? from supplied query string when ? present', () => {
            let current = stripDelimiter('?id=newId&key1=newValue1&key2=newValue2');
            expect(current).toBe('id=newId&key1=newValue1&key2=newValue2');
            current = stripDelimiter(current);
            expect(current).toBe('id=newId&key1=newValue1&key2=newValue2');
        });

        it('no-op for supplied query string when ? not present', () => {
            let current = stripDelimiter('id=newId&key1=newValue1&key2=newValue2');
            expect(current).toBe('id=newId&key1=newValue1&key2=newValue2');
        });
    })

    describe('buildQuery, asObject', () => {
        it('builds an inclusive new query string from object', () => {
            let newQuery = buildQuery({ key3: 'value3', key4: 'value4', key1: 'newValue1', encKey: '{"someValue":"meat & potatoes!?"}' });
            expect(newQuery.indexOf('key3=value3')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key4=value4')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key1=newValue1')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key2=value2')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('id=someId')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('encodedKey=Some%20Encoded%20Valu%C3%A9%3F')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('encKey=%7B%22someValue%22%3A%22meat%20%26%20potatoes!%3F%22%7D')).toBeGreaterThan(-1);
            let parsed = asObject(newQuery);
            expect(parsed.encKey).toBeDefined();
            expect(parsed.id).toBeDefined();
            expect(parsed.key1).toBeDefined();
            expect(parsed.key2).toBeDefined();
            expect(parsed.key3).toBeDefined();
            expect(parsed.key4).toBeDefined();
        });

        it('builds an exclusive new query string from object', () => {
            let newQuery = buildQuery({ key3: 'value3', key4: 'value4' }, true);
            expect(newQuery.indexOf('key3=value3')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key4=value4')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key1=value1')).toEqual(-1);
            expect(newQuery.indexOf('key2=value2')).toEqual(-1);
            expect(newQuery.indexOf('id=someId')).toEqual(-1);
            expect(newQuery.indexOf('encodedKey=Some%20Encoded%20Valu%C3%A9%3F')).toEqual(-1);
        });

        it('builds a new query string by stringifying objects', () => {
            let newQuery = buildQuery({ jsonKey: { key: 'value' }, arrayKey: [1, 2, 3, 4, 5] });
            expect(newQuery.indexOf('jsonKey=%7B%22key%22%3A%22value%22%7D')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('arrayKey=%5B1%2C2%2C3%2C4%2C5%5D')).toBeGreaterThan(-1);
        });

        it('builds a new query string from null incoming object', () => {
            let newQuery = buildQuery(null!, true);
            expect(newQuery).toBe('');
        });

        it('preserves and overwrites existing values when building new query', () => {
            // "http://www.roadtonowhere.com/path1/path2/?id=someId&key1=value1&key2=value2"
            let newQuery = buildQuery({ key3: 'value3', key4: 'value4', key2: 'value2r', keyNull: null });
            expect(newQuery.indexOf('key3=value3')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key4=value4')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key1=value1')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('key2=value2r')).toBeGreaterThan(-1);
            expect(newQuery.indexOf('keyNull')).toEqual(-1);
        });

        it('encodes component in query by default', () => {
            // "http://www.roadtonowhere.com/path1/path2/?id=someId&key1=value1&key2=value2"
            let newQuery = buildQuery({ encodedKey: '1,2' });
            expect(newQuery.indexOf('encodedKey=1%2C2')).toBeGreaterThan(-1);
        });

        it('encodes component in query explicitly', () => {
            // "http://www.roadtonowhere.com/path1/path2/?id=someId&key1=value1&key2=value2"
            let newQuery = buildQuery({ encodedKey: '1,2' }, false, true);
            expect(newQuery.indexOf('encodedKey=1%2C2')).toBeGreaterThan(-1);
        });

        it('does not encode component in query explicitly', () => {
            // "http://www.roadtonowhere.com/path1/path2/?id=someId&key1=value1&key2=value2"
            let newQuery = buildQuery({ encodedKey: '1,2' }, false, false);
            expect(newQuery.indexOf('encodedKey=1,2')).toBeGreaterThan(-1);
        });
    });

    it('updateQuery calls runtime.ui.updateQuery', async () => {
        await setupRuntime(() => { });
        runtime.ui.updateQuery = jest.fn();
        const query = "?a=b&c=d";
        updateQuery(query);
        expect(runtime.ui.updateQuery).toHaveBeenCalledTimes(1);
        expect(runtime.ui.updateQuery).toHaveBeenCalledWith(query);
    });
});
