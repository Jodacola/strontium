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
class SrUiComponent extends React.Component {
    constructor(props) {
        super(props);
        this.stateHelpers = new SrComponentStateHelpers(this);
        this.resizeListener = null;
        this.componentMounted = false;
        this.deferHandlers = {};
        this.state = this.initialState();
    }
    getRef(key) {
        return this.refs[key];
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
        this.cancelAllDeferrals();
        this.unregisterResizeHandler();
        this.unregisterHandlers();
        this.onComponentWillUnmount();
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
    cancelAllDeferrals() {
        Object.keys(this.deferHandlers).forEach(k => this.cancelDeferred(k));
    }
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
    broadcast(message, data) {
        runtime.messaging.broadcast(message, true, data);
    }
}
export default SrUiComponent;
//# sourceMappingURL=SrUiComponent.js.map