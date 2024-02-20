/**
 * @jest-environment jsdom
 */

import React from "react";
import { runtime, SrAppMessage } from "../../lib/lib";
import { setupRuntime, WithInitialStateComp, BareComp, WithHandlesComp, origAddEventListener, origTimeout, delay } from "../test_utils/UiUtils";
import {render, screen} from '@testing-library/react'

beforeEach(setupRuntime, 5000);

describe('SrUiComponent', () => {
    test('renders correctly', () => {
        render(<WithInitialStateComp numProp={12} strProp="test" />);
        expect(screen.getAllByRole('test-component')).toHaveLength(1);
    });

    test('base initialState returns empty object', () => {
        const component = new BareComp({}) as any;
        const initialState = component.initialState();
        expect(initialState).toBeDefined();
        expect(Object.keys(initialState).length).toBe(0);
    })

    test('applies initial state properly', () => {
        render(<WithInitialStateComp numProp={12} strProp="test" />);
        expect(screen.getByRole('test-num-value').textContent).toBe("12");
        expect(screen.getByRole('test-str-value').textContent).toBe("test");
    });

    test('applies initial state properly', () => {
        const state = (new WithInitialStateComp({numProp: 12, strProp:"test"})).initialState();
        expect(state.numState).toBe(12);
        expect(state.strState).toBe("test");
    });

    test('setRef for key returns same function', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const func = (instance as any).setRef("key1");
        const funcAgain = (instance as any).setRef("key1");
        expect(func).toEqual(funcAgain);
    });

    test('setRef with callback for key returns same function', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const func = (instance as any).setRef("key1", (ref: any) => { });
        const funcAgain = (instance as any).setRef("key1", (ref: any) => { });
        expect(func).toEqual(funcAgain);
    });

    test('setRef func stores item', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const func = (instance as any).setRef("key1");
        const obj = { someKey: "someValue" };
        func(obj);
    });

    test('setRef func stores item and calls callback', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const callback = jest.fn();
        const func = (instance as any).setRef("key1", callback);
        const obj = { someKey: "someValue" };
        func(obj);
        expect(callback).toHaveBeenCalledWith(obj);
    });

    test('setRef creates func in dictionary', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        expect((instance as any).refHandlers["key1"]).toBeUndefined();
        const func = (instance as any).setRef("key1");
        expect((instance as any).refHandlers["key1"]).toBe(func);
    });

    test('multiple setRefs return same func', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const func = (instance as any).setRef("key1");
        const func2 = (instance as any).setRef("key1");
        expect(func).toBe(func2);
    });

    test('assignRef stores item', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        (instance as any).setRef("key1");
        const obj = { someKey: "someValue" };
        (instance as any).assignRef("key1", obj);
        expect((instance as any).refHandles["key1"]).toBe(obj);
    });

    test('assignRef calls callback on item storage', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const callback = jest.fn();
        (instance as any).setRef("key1");
        const obj = { someKey: "someValue" };
        (instance as any).assignRef("key1", obj, callback);
        expect(callback).toHaveBeenCalledWith(obj);
    });

    test('assignRef doesn\'t store item if handler key not present', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const obj = { someKey: "someValue" };
        (instance as any).assignRef("key1", obj);
        expect((instance as any).refHandles["key1"]).toBeUndefined();
    });

    test('assignRef doesn\'t invoke callback if handler key not present', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const obj = { someKey: "someValue" };
        (instance as any).assignRef("key1", obj);
        expect((instance as any).refHandles["key1"]).toBeUndefined();
    });

    test('getRef returns stored item', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const func = (instance as any).setRef("key1");
        const obj = { someKey: "someValue" };
        func(obj);
        const otherObj = (instance as any).getRef("key1");
        expect(otherObj).toEqual(obj);
    });

    test('getRef for non-stored item returns nothing', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const otherObj = (instance as any).getRef("key1");
        expect(otherObj).toBeUndefined();
    });

    test('cleanUpRefs removes all ref handles and handlers', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const key1func = (instance as any).setRef("key1");
        const key2func = (instance as any).setRef("key2");
        key1func("key1value");
        key2func("key2value");
        (instance as any).cleanUpRefs();
        expect((instance as any).refHandles["key1"]).toBeUndefined();
        expect((instance as any).refHandlers["key1"]).toBeUndefined();
        expect((instance as any).refHandles["key2"]).toBeUndefined();
        expect((instance as any).refHandlers["key2"]).toBeUndefined();
    });

    test('component unmounts successfully', () => {
        const item = render(<WithInitialStateComp numProp={12} strProp="test" />);
        item.unmount();
    });

    test('component without getHandles implemented has no handles', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        const handles = instance.handles();
        expect(handles).toBeNull();
        const handlesFromGet = (instance as any).getHandles();
        expect(handlesFromGet).toBeNull();
    });

    test('component with getHandles implemented has no handles', () => {
        const instance = new WithHandlesComp({numProp: 12, strProp:"test"});
        const handles = instance.handles();
        expect(handles).toBeDefined();
        const handlesFromGet = (instance as any).getHandles();
        expect(handlesFromGet).toBeDefined();
        expect(handles).toEqual(handlesFromGet);
        expect(handles![0]).toBe("a handle");
    });

    test('component registers itself properly as handler', () => {
        const instance = new WithHandlesComp({numProp: 12, strProp:"test"});
        instance.customHandles = ["a new handle"];
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toBeUndefined();
        (instance as any).registerHandlers();
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toBeDefined();
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toContain(instance);
    });

    test('component deregisters itself properly as handler', () => {
        const instance = new WithHandlesComp({numProp: 12, strProp:"test"});
        instance.customHandles = ["a new handle"];
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toBeUndefined();
        (instance as any).registerHandlers();
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toBeDefined();
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toContain(instance);
        (instance as any).unregisterHandlers();
        expect((runtime.messaging as any).serviceHandlers["a new handle"]).toBeDefined();
        expect((runtime.messaging as any).serviceHandlers["a new handle"].length).toBe(0);
    });

    test('component calls onAppMessage when message received', () => {
        const instance = new WithInitialStateComp({numProp: 12, strProp:"test"});
        (instance as any).onAppMessage = jest.fn();
        const msg = new SrAppMessage("action", { data: 12 }, true);
        (instance as BareComp).receiveMessage(msg);
        expect((instance as any).onAppMessage).toHaveBeenCalledWith(msg);
    });

    test('onAppMessage calls with no adverse effects', () => {
        const instance = new BareComp({});
        const msg = new SrAppMessage("action", { data: 12 }, true);
        (instance as any).onAppMessage(msg);
    });

    test('component calls internal mounting methods when mounted', () => {
        const instance = new BareComp({});
        (instance as any).doComponentDidMount = jest.fn();
        (instance as any).componentDidMount();
        expect((instance as any).doComponentDidMount).toHaveBeenCalled();
    });

    test('component calls internal unmounting methods when mounted', () => {
        const instance = new BareComp({});
        (instance as any).doComponentWillUnmount = jest.fn();
        (instance as any).componentWillUnmount();
        expect((instance as any).doComponentWillUnmount).toHaveBeenCalled();
    });

    test('component calls internal new props method when new props', () => {
        const instance = new BareComp({});
        (instance as any).onUpdated = jest.fn();
        const prevProps = { propData: 12 };
        const prevState = { stateData: 13 };
        (instance as any).componentDidUpdate(prevProps, prevState);
        expect((instance as any).onUpdated).toHaveBeenCalledWith(prevProps, prevState);
    });

    test('component calls internal performRender methods when render called', () => {
        const instance = new BareComp({});
        (instance as any).performRender = jest.fn();
        (instance as any).render();
        expect((instance as any).performRender).toHaveBeenCalled();
    });

    test('base onCleanUp calls with no adverse effects', () => {
        const instance = new BareComp({});
        (instance as any).onCleanUp();
    });

    test('base onUpdated calls with no adverse effects', () => {
        const instance = new BareComp({});
        (instance as any).onUpdated({}, {});
    });

    test('base onComponentMounted calls with no adverse effects', () => {
        const instance = new BareComp({});
        (instance as any).onComponentMounted({});
    });

    test('base onComponentWillUnmount calls with no adverse effects', () => {
        const instance = new BareComp({});
        (instance as any).onComponentWillUnmount({});
    });

    test('base resizeCallback returns null', () => {
        const instance = new BareComp({});
        const callback = (instance as any).resizeCallback();
        expect(callback).toBeNull();
    });

    test('doComponentDidMount sets internal mounted flag and calls appropriate set-up methods', () => {
        const instance = new BareComp({}) as any;
        instance.registerHandlers = jest.fn();
        instance.registerResizeHandler = jest.fn();
        instance.onComponentMounted = jest.fn();

        expect(instance.componentMounted).toBe(false);
        expect(instance.registerHandlers).toHaveBeenCalledTimes(0);
        expect(instance.registerResizeHandler).toHaveBeenCalledTimes(0);
        expect(instance.onComponentMounted).toHaveBeenCalledTimes(0);

        instance.doComponentDidMount();

        expect(instance.componentMounted).toBe(true);
        expect(instance.registerHandlers).toHaveBeenCalledTimes(1);
        expect(instance.registerResizeHandler).toHaveBeenCalledTimes(1);
        expect(instance.onComponentMounted).toHaveBeenCalledTimes(1);
    });

    test('doComponentWillUnmount sets internal mounted flag and calls appropriate tear-down methods', () => {
        const instance = new BareComp({}) as any;
        instance.cancelAllDeferrals = jest.fn();
        instance.unregisterResizeHandler = jest.fn();
        instance.unregisterHandlers = jest.fn();
        instance.onComponentWillUnmount = jest.fn();
        instance.cleanUpRefs = jest.fn();
        instance.cleanUp = jest.fn();

        instance.componentDidMount(); // simulate lifecycle event

        expect(instance.componentMounted).toBe(true);
        expect(instance.cancelAllDeferrals).toHaveBeenCalledTimes(0);
        expect(instance.unregisterResizeHandler).toHaveBeenCalledTimes(1);
        expect(instance.unregisterHandlers).toHaveBeenCalledTimes(0);
        expect(instance.onComponentWillUnmount).toHaveBeenCalledTimes(0);
        expect(instance.cleanUpRefs).toHaveBeenCalledTimes(0);
        expect(instance.cleanUp).toHaveBeenCalledTimes(0);

        instance.doComponentWillUnmount();

        expect(instance.componentMounted).toBe(false);
        expect(instance.cancelAllDeferrals).toHaveBeenCalledTimes(1);
        expect(instance.unregisterResizeHandler).toHaveBeenCalledTimes(2);
        expect(instance.unregisterHandlers).toHaveBeenCalledTimes(1);
        expect(instance.onComponentWillUnmount).toHaveBeenCalledTimes(1);
        expect(instance.cleanUpRefs).toHaveBeenCalledTimes(1);
        expect(instance.cleanUp).toHaveBeenCalledTimes(1);
    });

    test('cleanUp nulls properties and calls onCleanUp', () => {
        const instance = new BareComp({}) as any;
        instance.onCleanUp = jest.fn();

        expect(instance.stateHelpers).toBeDefined();
        expect(instance.deferHandlers).toBeDefined();
        expect(instance.refHandlers).toBeDefined();
        expect(instance.refHandles).toBeDefined();
        expect(instance.onCleanUp).toHaveBeenCalledTimes(0);

        instance.cleanUp();

        expect(instance.stateHelpers).toBeNull();
        expect(instance.deferHandlers).toBeNull();
        expect(instance.refHandlers).toBeNull();
        expect(instance.refHandles).toBeNull();
        expect(instance.onCleanUp).toHaveBeenCalledTimes(1);
    });

    test('mounted returns componentMounted property', () => {
        const instance = new BareComp({});
        expect((instance as BareComp).mounted()).toBe(false);
        (instance as any).componentMounted = true;
        expect((instance as BareComp).mounted()).toBe(true);
    });

    test('registerResizeHandler does nothing if resizeCallback is null', () => {
        const instance = new BareComp({}) as any;
        instance.unregisterResizeHandler = jest.fn();
        window.addEventListener = jest.fn();
        instance.registerResizeHandler();
        expect(instance.unregisterResizeHandler).toHaveBeenCalledTimes(1);
        expect(instance.resizeListener).toBeNull();
        expect(window.addEventListener).toHaveBeenCalledTimes(0);
    });

    test('registerResizeHandler registers listener if resizeCallback is present', () => {
        const instance = new BareComp({}) as any;
        instance.unregisterResizeHandler = jest.fn();
        instance.resizeCallback = function () { return () => { } };
        window.addEventListener = jest.fn();
        instance.registerResizeHandler();
        expect(instance.unregisterResizeHandler).toHaveBeenCalledTimes(1);
        expect(instance.resizeListener).toBeDefined();
        expect(window.addEventListener).toHaveBeenCalledTimes(1);
    });

    test('resizeListener func called if window resized', () => {
        const instance = new BareComp({}) as any;
        const resizeCall = jest.fn();
        instance.resizeCallback = function () { return resizeCall; };
        window.addEventListener = origAddEventListener;
        instance.registerResizeHandler();
        window.dispatchEvent(new Event('resize'));
        expect(resizeCall).toHaveBeenCalledTimes(1);
    });

    test('unregisterResizeHandler unregisters listener if resizeCallback is present', () => {
        const instance = new BareComp({}) as any;
        instance.resizeListener = () => { };
        window.removeEventListener = jest.fn();
        instance.unregisterResizeHandler();
        expect(instance.resizeListener).toBeNull();
        expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    });

    test('unregisterResizeHandler does nothing if resizeCallback is not present', () => {
        const instance = new BareComp({}) as any;
        window.removeEventListener = jest.fn();
        instance.unregisterResizeHandler();
        expect(instance.resizeListener).toBeNull();
        expect(window.removeEventListener).toHaveBeenCalledTimes(0);
    });

    test('set calls stateHelpers.set with state', () => {
        const instance = new BareComp({}) as any;
        instance.stateHelpers.set = jest.fn();
        const value = { someKey: 12 };
        instance.set(value);
        expect(instance.stateHelpers.set).toHaveBeenCalledTimes(1);
        expect(instance.stateHelpers.set).toHaveBeenCalledWith(value);
    });

    test('setAsync calls stateHelpers.setAsync with state', () => {
        const instance = new BareComp({}) as any;
        instance.stateHelpers.setAsync = jest.fn();
        const value = { someKey: 12 };
        instance.setAsync(value);
        expect(instance.stateHelpers.setAsync).toHaveBeenCalledTimes(1);
        expect(instance.stateHelpers.setAsync).toHaveBeenCalledWith(value);
    });

    test('setPartial calls stateHelpers.setPartial with state', () => {
        const instance = new BareComp({}) as any;
        instance.stateHelpers.setPartial = jest.fn();
        const value = { someKey: 12 };
        instance.setPartial(value);
        expect(instance.stateHelpers.setPartial).toHaveBeenCalledTimes(1);
        expect(instance.stateHelpers.setPartial).toHaveBeenCalledWith(value);
    });

    test('setPartialAsync calls stateHelpers.setPartialAsync with state', () => {
        const instance = new BareComp({}) as any;
        instance.stateHelpers.setPartialAsync = jest.fn();
        const value = { someKey: 12 };
        instance.setPartialAsync(value);
        expect(instance.stateHelpers.setPartialAsync).toHaveBeenCalledTimes(1);
        expect(instance.stateHelpers.setPartialAsync).toHaveBeenCalledWith(value);
    });

    test('copyState calls stateHelpers.copyState', () => {
        const instance = new BareComp({}) as any;
        instance.stateHelpers.copyState = jest.fn();
        instance.copyState();
        expect(instance.stateHelpers.copyState).toHaveBeenCalledTimes(1);
    });

    test('deferred cancels previous deferral', () => {
        const instance = new BareComp({}) as any;
        instance.cancelDeferred = jest.fn();
        instance.deferred(() => { }, 1000, 'someId');
        expect(instance.cancelDeferred).toHaveBeenCalledTimes(1);
        expect(instance.cancelDeferred).toHaveBeenCalledWith('someId');
    });

    test('deferred sets handle for id', () => {
        const instance = new BareComp({}) as any;
        instance.deferred(() => { }, 1000, 'someId');
        expect(instance.deferHandlers["someId"]).toBeDefined();
    });

    test('deferred sets nothing when no id', () => {
        const instance = new BareComp({}) as any;
        instance.deferred(() => { }, 1000);
        expect(Object.keys(instance.deferHandlers).length).toBe(0);
    });

    test('deferred issues setTimeout', async () => {
        const instance = new BareComp({}) as any;
        (window as any).setTimeout = jest.fn();
        instance.deferred(() => { }, 500);
        expect(window.setTimeout).toHaveBeenCalledTimes(1);
    });

    test('deferred issues setTimeout of 0 when no timeout', async () => {
        const instance = new BareComp({}) as any;
        (window as any).setTimeout = jest.fn();
        instance.deferred(() => { });
        expect(window.setTimeout).toHaveBeenCalledTimes(1);
        expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
    });

    test('deferred setTimeout calls function', async () => {
        const instance = new BareComp({}) as any;
        window.setTimeout = origTimeout;
        const callback = jest.fn();
        instance.deferred(() => { callback() }, 500);
        expect(callback).toHaveBeenCalledTimes(0);
        await delay(1500);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('cancelAllDeferrrals cancels all pending deferrals', () => {
        const instance = new BareComp({}) as any;
        instance.cancelDeferred = jest.fn();
        instance.deferred(() => { }, 1000, 'id1');
        instance.deferred(() => { }, 1000, 'id2');
        expect(instance.cancelDeferred).toHaveBeenCalledTimes(2);
        instance.cancelAllDeferrals();
        expect(instance.cancelDeferred).toHaveBeenCalledTimes(4);
        expect(instance.cancelDeferred).toHaveBeenCalledWith('id1');
        expect(instance.cancelDeferred).toHaveBeenCalledWith('id2');
    });

    test('cancelDeferred cancels pending deferral', () => {
        const instance = new BareComp({}) as any;
        window.clearTimeout = jest.fn();
        instance.deferred(() => { }, 1000, 'id1');
        const handle = instance.deferHandlers['id1'];
        instance.cancelDeferred('id1');
        expect(window.clearTimeout).toHaveBeenCalledTimes(1);
        expect(window.clearTimeout).toHaveBeenCalledWith(handle);
        expect(instance.deferHandlers['id1']).toBeUndefined();
    });

    test('cancelDeferred cancels is no-op when no id', () => {
        const instance = new BareComp({}) as any;
        window.clearTimeout = jest.fn();
        instance.cancelDeferred();
        expect(window.clearTimeout).toHaveBeenCalledTimes(0);
    });

    test('cancelDeferred cancels is no-op when non-existent id', () => {
        const instance = new BareComp({}) as any;
        window.clearTimeout = jest.fn();
        instance.cancelDeferred('someId');;
        expect(window.clearTimeout).toHaveBeenCalledTimes(0);
    });
});