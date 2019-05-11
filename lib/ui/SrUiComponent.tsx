import * as React from "react";
import SrComponentStateHelpers from "./SrComponentStateHelpers";
import IMessageHandler from "../messaging/IMessageHandler";
import Log from "../framework/Log";
import SrAppMessage from "../messaging/SrAppMessage";
import { runtime } from "../framework/SrApp";

export default abstract class SrUiComponent<P, S> extends React.Component<P, S> implements IMessageHandler {
    private stateHelpers: SrComponentStateHelpers<P, S> = new SrComponentStateHelpers<P, S>(this);
    private resizeListener: EventListener = null;
    private componentMounted = false;
    private deferHandlers: { [id: string]: number } = {};
    private refHandlers: { [id: string]: (ref: any) => void } = {};
    private refHandles: { [id: string]: any } = {};

    constructor(props: any) {
        super(props);
        this.state = this.initialState();
    }

    /* Reference helpers */

    protected setRef(key: string): (ref: any) => void {
        if (!this.refHandlers[key]) {
            this.refHandlers[key] = (ref) => this.assignRef(key, ref);
        }

        return this.refHandlers[key];
    }

    private assignRef(key: string, ref: any) {
        Log.t(this, "Assigning ref", { key, refPresent: !!ref });
        if (this.refHandlers && this.refHandlers[key]) {
            this.refHandles[key] = ref;
        }
    }

    protected getRef<T>(key: string) {
        return this.refHandles[key] as T;
    }

    private cleanUpRefs() {
        Log.t(this, "Cleaning up refs");
        for (var key of Object.keys(this.refHandlers)) {
            delete this.refHandlers[key];
            delete this.refHandles[key];
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

    componentDidMount() {
        this.doComponentDidMount();
    };

    componentWillReceiveProps(props: P) {
        Log.t(this, "Receiving props update");
        this.onNewProps(props);
    }

    componentWillUnmount() {
        this.doComponentWillUnmount();
    };

    private doComponentDidMount() {
        Log.t(this, "Mounted");
        this.componentMounted = true;
        this.registerHandlers();
        this.registerResizeHandler();
        this.onComponentMounted();
    };

    private doComponentWillUnmount() {
        Log.t(this, "Will unmount");
        this.cancelAllDeferrals();
        this.unregisterResizeHandler();
        this.unregisterHandlers();
        this.onComponentWillUnmount();
        this.componentMounted = false;
        this.cleanUpRefs();
        this.cleanUp();
    };

    private cleanUp(): void {
        this.stateHelpers = null;
        this.deferHandlers = null;
        this.refHandlers = null;
        this.refHandles = null;
        this.onCleanUp();
    };

    /**
     * Implement to clean up component resources at the end of a component's lifecycle.
     * Do not modify state or issue deferrals when implementing.
     */
    protected onCleanUp(): void { };

    render(): React.ReactNode {
        Log.t(this, "Will render");
        return this.performRender();
    };

    /* React-triggered Functions */
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
    protected deferred(func: Function, time: number = 0, id: string = null) {
        this.cancelDeferred(id);

        var handle = window.setTimeout(() => {
            func();
        }, time);

        if (id) {
            this.deferHandlers[id] = handle;
        }
    };

    protected cancelAllDeferrals() {
        for (const key of Object.keys(this.deferHandlers)) {
            this.cancelDeferred(key);
        }
    }

    protected cancelDeferred(id: string) {
        if (id && this.deferHandlers[id]) {
            clearTimeout(this.deferHandlers[id]);
        }

        delete this.deferHandlers[id];
    }

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
}
