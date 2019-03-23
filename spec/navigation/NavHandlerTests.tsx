import NavHandler from "../../lib/navigation/NavHandler";
import { createElement } from "react";
import { parseMatches } from "../../lib/navigation/NavHandlerUtils";
import NavigationTarget from "../../lib/navigation/NavigationTarget";
import React from "react";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe("NavHandler", () => {
    it('returns the title from typeIdentifier()', () => {
        const handler = new NavHandler('/app/path/', 'Route title', () => createElement('div'));
        expect(handler.typeIdentifier()).toBe('Route title');
    });

    it('builds the element', () => {
        const handler = new NavHandler('/app/path/:value', 'Route title', (data, parsed) => <div className={data.query.query}>{parsed.value}</div>);
        const target = new NavigationTarget('/app/path/something?query=queryValue', { key: 'value' }, '');
        handler.handlesType(target);
        const built = Enzyme.shallow(handler.buildElement(target));
        expect(built.find('.queryValue')).toHaveLength(1);
        expect(built.text()).toBe('something');
    });

    it('returns the title from getTitle()', () => {
        const handler = new NavHandler('/app/path/', 'Route title', () => createElement('div'));
        expect(handler.getTitle()).toBe('Route title');
    });

    it('returns the match pattern from matchPattern()', () => {
        const handler = new NavHandler('/app/path/', 'Route title', () => createElement('div'));
        const pattern = handler.matchPattern();
        const testedPattern = parseMatches('/app/path');
        expect(pattern).toEqual(testedPattern);
    });

    it('returns the cached match pattern from matchPattern()', () => {
        const handler = new NavHandler('/app/path/', 'Route title', () => createElement('div'));
        const pattern = handler.matchPattern();
        (handler as any)._route = "/something/else";
        const patternCompare = handler.matchPattern();
        expect(pattern).toEqual(patternCompare);
    });

    it('properly fails to match non-matching data', () => {
        const handler = new NavHandler('/app/path/', 'Route title', () => createElement('div'));
        const target = new NavigationTarget('/app/miss', {}, '');
        const result = handler.handlesType(target);
        expect(result).toBe(false);
    });

    it('properly matches target and parses data', () => {
        const handler = new NavHandler('/app/path/:value', 'Route title', () => createElement('div'));
        const target = new NavigationTarget('/app/path/something', {}, '');
        const result = handler.handlesType(target);
        expect(result).toBe(true);
        expect(target.parsed.value).toBe('something');
    });
});