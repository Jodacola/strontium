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
import { RequestType } from "../api/API";
import { EnvironmentUtility as EnvUtils } from "../utils/Utils";
class SrUiComponent extends React.Component {
    constructor(props) {
        super(props);
        this.resizeListener = null;
        this.componentMounted = false;
        this.deferHandlers = {};
        this.elementRefs = {};
        this.refHandlers = {};
        this.state = this.initialState();
    }
    getRefHandler(key) {
        if (!this.refHandlers[key]) {
            this.refHandlers[key] = (ref) => {
                this.elementRefs[key] = ref;
            };
        }
        return this.refHandlers[key];
    }
    getRef(key) {
        return this.elementRefs[key];
    }
    getJRef(key) {
        if (!EnvUtils.jqueryLoaded()) {
            return null;
        }
        return $(this.elementRefs[key]);
    }
    cleanUpRefs() {
        for (var key in this.refHandlers) {
            delete this.refHandlers[key];
        }
        for (var key in this.elementRefs) {
            delete this.elementRefs[key];
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
    handlesLocal() {
        var handles = this.getHandlesLocal();
        Log.t(this, "Returning local handler registrations", { handles: handles });
        return handles;
    }
    getHandlesLocal() {
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
    componentWillMount() {
        Log.t(this, "Will mount");
    }
    ;
    componentDidMount() {
        Log.t(this, "Mounted");
        this.componentMounted = true;
        this.registerHandlers();
        this.registerResizeHandler();
        this.onComponentMounted();
    }
    ;
    componentWillReceiveProps(props) {
        Log.t(this, "Receiving props update");
        this.onNewProps(props);
    }
    componentWillUnmount() {
        Log.t(this, "Will unmount");
        this.unregisterResizeHandler();
        this.unregisterHandlers();
        this.onComponentWillUnmount();
        this.cleanUpRefs();
        this.componentMounted = false;
    }
    ;
    render() {
        Log.t(this, "Will render");
        return this.performRender();
    }
    ;
    /* React-triggered Functions */
    onComponentWillMount() { }
    ;
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
    navigate(url, title, data, navOptions) {
        var query = this.buildNavQuery(navOptions);
        Log.d(this, "Navigating from element", { url: url, title: title, data: data, query: query });
        runtime.ui.navigate(url + query, title, data);
    }
    ;
    navigateOptions(navOptions) {
        Log.d(this, "Navigating with options", navOptions);
        var path = document.location.pathname.replace(`/${runtime.ui.appBasePath()}/`, "");
        var title = document.title;
        this.navigate(path, title, null, navOptions);
    }
    buildNavQuery(navOptions) {
        if (navOptions == null) {
            return "";
        }
        var query = "";
        Object.keys(navOptions).forEach((k) => {
            var value = (navOptions[k] || "").toString();
            if (value.length) {
                query = this.addQueryItem(query, k, value.toString());
            }
        });
        if (query.length) {
            return `?${query}`;
        }
        return "";
    }
    localize(msg) {
        return msg;
    }
    ;
    /* API Helpers */
    resourceCreate(resource, data = null, handler = null) {
        return this.sendRequest(RequestType.Create, (resource || "").toString(), data, handler);
    }
    ;
    resourceRead(resource, data = null, handler = null) {
        return this.sendRequest(RequestType.Read, (resource || "").toString(), data, handler);
    }
    ;
    resourceUpdate(resource, data = null, handler = null) {
        return this.sendRequest(RequestType.Update, (resource || "").toString(), data, handler);
    }
    ;
    resourceDelete(resource, data = null, handler = null) {
        return this.sendRequest(RequestType.Delete, (resource || "").toString(), data, handler);
    }
    ;
    sendRequest(type, resource, data = null, handler = null) {
        return new Promise(resolve => {
            runtime.api.sendMessage(type, resource, data, (r) => {
                resolve(r);
                if (handler) {
                    handler(r);
                }
            });
        });
    }
    /* END API Helpers */
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
    /* State Helpers */
    set(state) {
        if (!this.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
        }
        Log.t(this, "Setting new state", state);
        this.setState(state);
    }
    setPartial(obj) {
        Log.d(this, "Setting partial data on state", obj);
        var state = this.copyState();
        Object.assign(state, obj);
        this.set(state);
    }
    setAsync(state) {
        if (!this.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
        }
        Log.t(this, "Setting new state", state);
        return new Promise(resolve => {
            this.setState(state, () => {
                resolve(state);
            });
        });
    }
    setPartialAsync(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            Log.d(this, "Setting partial data on state", obj);
            var state = this.copyState();
            Object.assign(state, obj);
            yield this.setAsync(state);
        });
    }
    copyState() {
        if (!this.state) {
            return null;
        }
        var copy = {};
        for (var key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                copy[key] = this.state[key];
            }
        }
        return copy;
    }
    /* END State Helpers */
    cancelDeferred(id) {
        if (id && this.deferHandlers[id]) {
            clearTimeout(this.deferHandlers[id]);
        }
    }
    updateQuery(query) {
        if (!this.mounted()) {
            return;
        }
        runtime.ui.updateQuery(query);
    }
    addQueryItem(query, key, value) {
        if (query.length != 0) {
            query += "&";
        }
        query += key + "=" + encodeURIComponent(value);
        return query;
    }
    classes(...classes) {
        return (classes || []).filter((c) => { return !!c; }).join(" ");
    }
    if(condition, className) {
        if (condition) {
            return className;
        }
        return null;
    }
    /**
     * Returns a promise that resolves after the provided delay.
     * @param {Number} milliseconds The delay in milliseconds before the promise is resolved.
     */
    delay(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
    broadcast(message, data) {
        runtime.messaging.broadcastLocal(message, data);
    }
}
export default SrUiComponent;
//# sourceMappingURL=SrUiComponent.js.map