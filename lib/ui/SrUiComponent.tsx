import { Log, runtime } from "../framework/Framework";
import * as React from "react";
import { IApiLoadingState, LoadStates, SrServiceResponse, RequestType } from "../api/API";
import { IMessageHandler, SrAppMessage } from "../messaging/Messaging";
import { EnvironmentUtility as EnvUtils } from "../utils/Utils";

abstract class SrUiComponent<P, S> extends React.Component<P, S> implements IMessageHandler {
    private resizeListener: EventListener = null;
    private componentMounted = false;
    private deferHandlers: { [id: string]: number } = {};
    private elementRefs: { [id: string]: HTMLElement } = {};
    private refHandlers: { [id: string]: (ref: HTMLElement) => void } = {};

    constructor(props: any) {
        super(props);
        this.state = this.initialState();
    }

    protected getRefHandler<T extends HTMLElement>(key: string): (ref: T) => void {
        if (!this.refHandlers[key]) {
            this.refHandlers[key] = (ref: T) => {
                this.elementRefs[key] = ref;
            }
        }
        return this.refHandlers[key];
    }

    protected getRef<T extends HTMLElement>(key: string) {
        return this.elementRefs[key] as T;
    }

    protected getJRef(key: string): JQuery {
        if (!EnvUtils.jqueryLoaded()) {
            return null;
        }
        return $(this.elementRefs[key]);
    }

    protected cleanUpRefs(): void {
        for (var key in this.refHandlers) {
            delete this.refHandlers[key];
        }

        for (var key in this.elementRefs) {
            delete this.elementRefs[key];
        }
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

    handlesLocal(): string[] {
        var handles = this.getHandlesLocal();
        Log.t(this, "Returning local handler registrations", { handles: handles });
        return handles;
    }

    protected getHandlesLocal(): string[] {
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
        this.cleanUpRefs();
        this.componentMounted = false;
    };

    render(): JSX.Element {
        Log.t(this, "Will render");
        return this.performRender();
    };

    /* React-triggered Functions */
    protected onComponentWillMount(): void { };
    protected onComponentMounted(): void { };
    protected onComponentWillUnmount(): void { };

    abstract performRender(): JSX.Element;

    /* Misc helpers */
    protected mounted(): boolean {
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

    /* API Helpers */
    protected resourceCreate(resource: any, data: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Create, (resource || "").toString(), data, handler);
    };

    protected resourceRead(resource: any, data: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Read, (resource || "").toString(), data, handler);
    };

    protected resourceUpdate(resource: any, data: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Update, (resource || "").toString(), data, handler);
    };

    protected resourceDelete(resource: any, data: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return this.sendRequest(RequestType.Delete, (resource || "").toString(), data, handler);
    };

    private sendRequest(type: RequestType, resource: string, data: any = null, handler: (r: SrServiceResponse) => void = null): Promise<SrServiceResponse> {
        return new Promise<SrServiceResponse>(resolve => {
            runtime.api.sendMessage(type, resource, data, (r: SrServiceResponse) => {
                resolve(r);
                if (handler) {
                    handler(r);
                }
            });
        });
    }
    /* END API Helpers */

    protected deferred(func: Function, time: number = 0, id: string = null) {
        this.cancelDeferred(id);

        var handle = window.setTimeout(() => {
            func();
        }, time);

        if (id) {
            this.deferHandlers[id] = handle;
        }
    };

    /* State Helpers */
    protected set(state: S): void {
        if (!this.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
        }
        Log.t(this, "Setting new state", state);
        this.setState(state);
    }

    protected setPartial(obj: Partial<S>): void {
        Log.d(this, "Setting partial data on state", obj);
        var state = this.copyState();
        Object.assign(state, obj);
        this.set(state);
    }

    protected setAsync(state: S): Promise<S> {
        if (!this.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
        }
        Log.t(this, "Setting new state", state);
        return new Promise(resolve => {
            this.setState(state,
                () => {
                    resolve(state);
                });
        });
    }

    protected async setPartialAsync(obj: Partial<S>) {
        Log.d(this, "Setting partial data on state", obj);
        var state = this.copyState();
        Object.assign(state, obj);
        await this.setAsync(state);
    }

    protected copyState(): S {
        if (!this.state) {
            return null;
        }
        var copy: any = {};
        for (var key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                copy[key] = this.state[key];
            }
        }
        return copy as S;
    }

    /* END State Helpers */

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

    /**
     * Returns a promise that resolves after the provided delay.
     * @param {Number} milliseconds The delay in milliseconds before the promise is resolved.
     */
    protected delay(milliseconds: number): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }


    protected broadcast(message: string, data?: any) {
        runtime.messaging.broadcastLocal(message, data);
    }
}

export default SrUiComponent;