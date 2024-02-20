/**
 * @jest-environment jsdom
 */

import React from "react";
import { setupRuntime, BareComp, delay } from "../test_utils/UiUtils";
import SrComponentStateHelpers from "../../lib/ui/SrComponentStateHelpers";

beforeEach(() => setupRuntime, 5000);

describe('SrUiComponentStateHelpers', () => {
    describe('set', () => {
        it('returns if component not mounted', () => {
            const instance = new BareComp({});
            instance.mounted = jest.fn(() => false);
            instance.setState = jest.fn();
            const helper = new SrComponentStateHelpers(instance);
            helper.set({});
            expect(instance.mounted).toHaveBeenCalledTimes(1);
            expect(instance.setState).toHaveBeenCalledTimes(0);
        });

        it('calls setState if mounted', () => {
            const instance = new BareComp({});
            instance.mounted = jest.fn(() => true);
            instance.setState = jest.fn();
            const helper = new SrComponentStateHelpers(instance);
            const value = { someKey: 12 };
            helper.set(value);
            expect(instance.mounted).toHaveBeenCalledTimes(1);
            expect(instance.setState).toHaveBeenCalledTimes(1);
            expect(instance.setState).toHaveBeenCalledWith(value);
        });
    });

    describe('setPartial', () => {
        it('copies current state and merges immediately when unbatched', () => {
            const instance = new BareComp({});
            const helper = new SrComponentStateHelpers(instance);
            helper.copyState = jest.fn(() => { return { firstKey: 10, secondKey: "value" } });
            let newValue: any = null;
            helper.set = jest.fn((value) => { newValue = value; });
            helper.setPartial({ firstKey: 12 }, false);
            expect(helper.copyState).toHaveBeenCalledTimes(1);
            expect(helper.set).toHaveBeenCalledTimes(1);
            expect(newValue.firstKey).toBe(12);
            expect(newValue.secondKey).toBe("value");
        });

        it('eventually copies current state and merges when batched', async () => {
            const instance = new BareComp({});
            const helper = new SrComponentStateHelpers(instance);
            helper.copyState = jest.fn(() => { return { firstKey: 10, secondKey: "value", thirdKey: "original" } });
            let newValue: any = null;
            helper.set = jest.fn((value) => { newValue = value; });
            helper.setPartial({ firstKey: 12 });
            helper.setPartial({ secondKey: "new value" });
            expect(helper.copyState).toHaveBeenCalledTimes(0);
            expect(helper.set).toHaveBeenCalledTimes(0);
            expect(newValue).toBeNull();
            await delay(10);
            expect(helper.copyState).toHaveBeenCalledTimes(1);
            expect(helper.set).toHaveBeenCalledTimes(1);
            expect(newValue.firstKey).toBe(12);
            expect(newValue.secondKey).toBe("new value");
            expect(newValue.thirdKey).toBe("original");
        });
    });

    describe('setAsync', () => {
        it('returns no-op promise if component not mounted', async () => {
            const instance = new BareComp({});
            instance.mounted = jest.fn(() => false);
            instance.setState = jest.fn();
            const helper = new SrComponentStateHelpers(instance);
            const promise = helper.setAsync({}) as Promise<any>;
            expect(instance.mounted).toHaveBeenCalledTimes(1);
            const resolved = await promise;
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(resolved).toMatchObject({});
        });

        it('sets state via promise if mounted', async () => {
            const instance = new BareComp({});
            instance.mounted = jest.fn(() => true);
            instance.setState = jest.fn((value, resolve: any) => { resolve(value); });
            const helper = new SrComponentStateHelpers(instance);
            const value = { someKey: 12 };
            const promise = helper.setAsync(value) as Promise<any>;
            expect(instance.mounted).toHaveBeenCalledTimes(1);
            const resolved = await promise;
            expect(instance.setState).toHaveBeenCalledTimes(1);
            expect(resolved).toBe(value);
            expect(instance.setState).toHaveBeenCalledWith(value, expect.anything());
        });
    });

    describe('setPartialAsync', () => {
        it('copies current state and merges via promise', () => {
            const instance = new BareComp({});
            const helper = new SrComponentStateHelpers(instance);
            helper.copyState = jest.fn(() => { return { firstKey: 10, secondKey: "value" } });
            let newValue: any = null;
            let promise = new Promise<any>(() => { });
            helper.setAsync = jest.fn((value) => { newValue = value; return promise; });
            const returnPromise = helper.setPartialAsync({ firstKey: 12 });
            expect(helper.copyState).toHaveBeenCalledTimes(1);
            expect(helper.setAsync).toHaveBeenCalledTimes(1);
            expect(newValue.firstKey).toBe(12);
            expect(newValue.secondKey).toBe("value");
            expect(returnPromise).toEqual(promise);
        });
    });

    describe('copyState', () => {
        it('returns null if component has no state', () => {
            const instance = new BareComp({});
            instance.state = undefined!;
            const helper = new SrComponentStateHelpers(instance);
            const copy = helper.copyState();
            expect(copy).toBeNull();
        });

        it('returns copied state if component has state', () => {
            const instance = new BareComp({});
            instance.state = { keyA: 12, keyB: "valueB" };
            const helper = new SrComponentStateHelpers(instance);
            const copy = helper.copyState();
            expect(copy).toBeDefined();
            expect(copy).toMatchObject(instance.state);
            expect(copy === instance).toBe(false);
        });
    });
});