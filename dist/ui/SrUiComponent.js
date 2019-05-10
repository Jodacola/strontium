var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Log, runtime } from "../framework/Framework";
import * as React from "react";
import SrComponentStateHelpers from "./SrComponentStateHelpers";
export default class SrUiComponent extends React.Component {
    constructor(props) {
        super(props);
        this.stateHelpers = new SrComponentStateHelpers(this);
        this.resizeListener = null;
        this.componentMounted = false;
        this.deferHandlers = {};
        this.refHandlers = {};
        this.refHandles = {};
        this.state = this.initialState();
    }
    /* Reference helpers */
    setRef(key) {
        if (!this.refHandlers[key]) {
            this.refHandlers[key] = (ref) => this.assignRef(key, ref);
        }
        return this.refHandlers[key];
    }
    assignRef(key, ref) {
        Log.t(this, "Assigning ref", { key, refPresent: !!ref });
        if (this.refHandlers && this.refHandlers[key]) {
            this.refHandles[key] = ref;
        }
    }
    getRef(key) {
        return this.refHandles[key];
    }
    cleanUpRefs() {
        Log.t(this, "Cleaning up refs");
        for (var key of Object.keys(this.refHandlers)) {
            delete this.refHandlers[key];
            delete this.refHandles[key];
        }
    }
    /* IMessageHandler Implementation Details */
    handles() {
        var handles = this.getHandles();
        Log.t(this, "Returning handler registrations", { handles: handles });
        return handles;
    }
    getHandles() {
        return null;
    }
    receiveMessage(msg) {
        Log.t(this, "Got app message", { message: msg });
        this.onAppMessage(msg);
    }
    onAppMessage(msg) {
    }
    registerHandlers() {
        Log.t(this, "Registering handlers");
        runtime.messaging.registerHandler(this);
    }
    unregisterHandlers() {
        Log.t(this, "Deregistering handlers");
        runtime.messaging.removeHandler(this);
    }
    /* React Implementation */
    initialState() {
        return {};
    }
    ;
    componentDidMount() {
        this.doComponentDidMount();
    }
    ;
    componentWillReceiveProps(props) {
        Log.t(this, "Receiving props update");
        this.onNewProps(props);
    }
    componentWillUnmount() {
        this.doComponentWillUnmount();
    }
    ;
    doComponentDidMount() {
        Log.t(this, "Mounted");
        this.componentMounted = true;
        this.registerHandlers();
        this.registerResizeHandler();
        this.onComponentMounted();
    }
    ;
    doComponentWillUnmount() {
        Log.t(this, "Will unmount");
        this.cancelAllDeferrals();
        this.unregisterResizeHandler();
        this.unregisterHandlers();
        this.onComponentWillUnmount();
        this.componentMounted = false;
        this.cleanUpRefs();
        this.cleanUp();
    }
    ;
    cleanUp() {
        this.stateHelpers = null;
        this.deferHandlers = null;
        this.refHandlers = null;
        this.refHandles = null;
        this.onCleanUp();
    }
    ;
    /**
     * Implement to clean up component resources at the end of a component's lifecycle.
     * Do not modify state or issue deferrals when implementing.
     */
    onCleanUp() { }
    ;
    render() {
        Log.t(this, "Will render");
        return this.performRender();
    }
    ;
    /* React-triggered Functions */
    onComponentMounted() { }
    ;
    onComponentWillUnmount() { }
    ;
    /* Misc helpers */
    mounted() {
        return this.componentMounted;
    }
    onNewProps(props) {
    }
    /* Window Resizing */
    resizeCallback() {
        return null;
    }
    ;
    registerResizeHandler() {
        this.unregisterResizeHandler();
        var rc = this.resizeCallback();
        if (!rc) {
            return;
        }
        this.resizeListener = (e) => {
            rc();
        };
        window.addEventListener("resize", this.resizeListener, true);
    }
    ;
    unregisterResizeHandler() {
        if (this.resizeListener) {
            window.removeEventListener("resize", this.resizeListener, true);
            this.resizeListener = null;
        }
    }
    ;
    /* Utility Functions */
    deferred(func, time = 0, id = null) {
        this.cancelDeferred(id);
        var handle = window.setTimeout(() => {
            func();
        }, time);
        if (id) {
            this.deferHandlers[id] = handle;
        }
    }
    ;
    cancelAllDeferrals() {
        for (const key of Object.keys(this.deferHandlers)) {
            this.cancelDeferred(key);
        }
    }
    cancelDeferred(id) {
        if (id && this.deferHandlers[id]) {
            clearTimeout(this.deferHandlers[id]);
        }
        delete this.deferHandlers[id];
    }
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] set(state).
     */
    set(state) {
        return this.stateHelpers.set(state);
    }
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setPartial(state).
     */
    setPartial(obj) {
        return this.stateHelpers.setPartial(obj);
    }
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setAsync(state).
     */
    setAsync(state) {
        return this.stateHelpers.setAsync(state);
    }
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setPartialAsync(state).
     */
    setPartialAsync(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stateHelpers.setPartialAsync(obj);
        });
    }
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] copyState().
     */
    copyState() {
        return this.stateHelpers.copyState();
    }
}
//# sourceMappingURL=SrUiComponent.js.map