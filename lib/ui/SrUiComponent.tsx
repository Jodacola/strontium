import { Log, runtime } from "../framework/Framework";
import * as React from "react";
import { IApiLoadingState, LoadStates, SrServiceResponse, RequestType } from "../api/API";
import { IMessageHandler, SrAppMessage } from "../messaging/Messaging";
import { EnvironmentUtility as EnvUtils } from "../utils/Utils";
import SrComponentStateHelpers from "./SrComponentStateHelpers";

abstract class SrUiComponent<P, S> extends React.Component<P, S> implements IMessageHandler {
    private stateHelpers: SrComponentStateHelpers<P, S> = new SrComponentStateHelpers<P, S>(this);
    private resizeListener: EventListener = null;
    private componentMounted = false;
    private deferHandlers: { [id: string]: number } = {};
    private elementRefs: { [id: string]: HTMLElement } = {};
    private refHandlers: { [id: string]: (ref: HTMLElement) => void } = {};

    constructor(props: any) {
        super(props);
        this.state = this.initialState();
    }

    protected getRef<T extends HTMLElement>(key: string) {
        return this.refs[key] as T;
    }

    /* IMessageHandler Implementation Details */

    handles(): string[] {
        var handles = this.getHandles();
        Log.t(this, "Returning handler registrations", { handles: handles });
        return handles;
    }

    protected getHandles(): string[] {
        return null;
    }

    receiveMessage(msg: SrAppMessage): void {
        Log.t(this, "Got app message", { message: msg });
        this.onAppMessage(msg);
    }

    protected onAppMessage(msg: SrAppMessage) {

    }

    private registerHandlers() {
        Log.t(this, "Registering handlers");
        runtime.messaging.registerHandler(this);
    }

    private unregisterHandlers() {
        Log.t(this, "Deregistering handlers");
        runtime.messaging.removeHandler(this);
    }

    /* React Implementation */
    protected initialState(): S {
        return {} as S;
    };

    componentWillMount() {
        Log.t(this, "Will mount");
    };

    componentDidMount() {
        Log.t(this, "Mounted");
        this.componentMounted = true;
        this.registerHandlers();
        this.registerResizeHandler();
        this.onComponentMounted();
    };

    componentWillReceiveProps(props: P) {
        Log.t(this, "Receiving props update");
        this.onNewProps(props);
    }

    componentWillUnmount() {
        Log.t(this, "Will unmount");
        this.unregisterResizeHandler();
        this.unregisterHandlers();
        this.onComponentWillUnmount();
        this.componentMounted = false;
    };

    render(): React.ReactNode {
        Log.t(this, "Will render");
        return this.performRender();
    };

    /* React-triggered Functions */
    protected onComponentWillMount(): void { };
    protected onComponentMounted(): void { };
    protected onComponentWillUnmount(): void { };

    abstract performRender(): React.ReactNode;

    /* Misc helpers */
    public mounted(): boolean {
        return this.componentMounted;
    }

    protected onNewProps(props: P): void {

    }

    /* Window Resizing */
    protected resizeCallback(): () => void {
        return null;
    };

    protected registerResizeHandler(): void {
        this.unregisterResizeHandler();

        var rc: () => void = this.resizeCallback();
        if (!rc) {
            return;
        }

        this.resizeListener = (e: Event) => {
            rc();
        };

        window.addEventListener("resize", this.resizeListener, true);
    };

    protected unregisterResizeHandler(): void {
        if (this.resizeListener) {
            window.removeEventListener("resize", this.resizeListener, true);
            this.resizeListener = null;
        }
    };

    /* Utility Functions */
    protected navigate(url: string, title?: string, data?: any, navOptions?: any): void {
        var query = this.buildNavQuery(navOptions);
        Log.d(this, "Navigating from element", { url: url, title: title, data: data, query: query });
        runtime.ui.navigate(url + query, title, data);
    };

    protected navigateOptions(navOptions: any) {
        Log.d(this, "Navigating with options", navOptions);
        var path = document.location.pathname.replace(`/${runtime.ui.appBasePath()}/`, "");
        var title = document.title;
        this.navigate(path, title, null, navOptions);
    }

    protected buildNavQuery(navOptions: any) {
        if (navOptions == null) {
            return "";
        }

        var query = "";
        Object.keys(navOptions).forEach((k) => {
            var value: any = (navOptions[k] || "").toString();
            if (value.length) {
                query = this.addQueryItem(query, k, value.toString());
            }
        });
        if (query.length) {
            return `?${query}`;
        }
        return "";
    }

    protected localize(msg: string): string {
        return msg;
    };

    protected deferred(func: Function, time: number = 0, id: string = null) {
        this.cancelDeferred(id);

        var handle = window.setTimeout(() => {
            func();
        }, time);

        if (id) {
            this.deferHandlers[id] = handle;
        }
    };

    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] set(state).
     */
    protected set(state: S): void {
        return this.stateHelpers.set(state);
    }

    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setPartial(state).
     */
    protected setPartial(obj: Partial<S>): void {
        return this.stateHelpers.setPartial(obj);
    }

    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setAsync(state).
     */
    protected setAsync(state: S): Promise<S> {
        return this.stateHelpers.setAsync(state);
    }

    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setPartialAsync(state).
     */
    protected async setPartialAsync(obj: Partial<S>) {
        return this.stateHelpers.setPartialAsync(obj);
    }

    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] copyState().
     */
    protected copyState(): S {
        return this.stateHelpers.copyState();
    }

    protected cancelDeferred(id: string) {
        if (id && this.deferHandlers[id]) {
            clearTimeout(this.deferHandlers[id]);
        }
    }

    protected updateQuery(query: string) {
        if (!this.mounted()) {
            return;
        }
        runtime.ui.updateQuery(query);
    }

    protected addQueryItem(query: string, key: string, value: string): string {
        if (query.length != 0) {
            query += "&";
        }
        query += key + "=" + encodeURIComponent(value);
        return query;
    }

    protected classes(...classes: string[]): string {
        return (classes || []).filter((c) => { return !!c; }).join(" ");
    }

    protected if(condition: boolean, className: string): string {
        if (condition) {
            return className;
        }
        return null;
    }

    protected broadcast(message: string, data?: any) {
        runtime.messaging.broadcast(message, true, data);
    }
}

export default SrUiComponent;