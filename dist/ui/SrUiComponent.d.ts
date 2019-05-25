import * as React from "react";
import IMessageHandler from "../messaging/IMessageHandler";
import SrAppMessage from "../messaging/SrAppMessage";
export default abstract class SrUiComponent<P, S> extends React.Component<P, S> implements IMessageHandler {
    private stateHelpers;
    private resizeListener;
    private componentMounted;
    private deferHandlers;
    private refHandlers;
    private refHandles;
    constructor(props: any);
    protected setRef(key: string): (ref: any) => void;
    private assignRef;
    protected getRef<T>(key: string): T;
    private cleanUpRefs;
    handles(): string[];
    protected getHandles(): string[];
    receiveMessage(msg: SrAppMessage): void;
    protected onAppMessage(msg: SrAppMessage): void;
    private registerHandlers;
    private unregisterHandlers;
    protected initialState(): S;
    componentDidMount(): void;
    componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void;
    componentWillUnmount(): void;
    private doComponentDidMount;
    private doComponentWillUnmount;
    private cleanUp;
    /**
     * Implement to clean up component resources at the end of a component's lifecycle.
     * Do not modify state or issue deferrals when implementing.
     */
    protected onCleanUp(): void;
    render(): React.ReactNode;
    protected onComponentMounted(): void;
    protected onComponentWillUnmount(): void;
    abstract performRender(): React.ReactNode;
    mounted(): boolean;
    protected onUpdated(prevProps: Readonly<P>, prevState: Readonly<S>): void;
    protected resizeCallback(): () => void;
    protected registerResizeHandler(): void;
    protected unregisterResizeHandler(): void;
    protected deferred(func: Function, time?: number, id?: string): void;
    protected cancelAllDeferrals(): void;
    protected cancelDeferred(id: string): void;
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] set(state).
     */
    protected set(state: S): void;
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setPartial(state).
     */
    protected setPartial(obj: Partial<S>): void;
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setAsync(state).
     */
    protected setAsync(state: S): Promise<S>;
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] setPartialAsync(state).
     */
    protected setPartialAsync(obj: Partial<S>): Promise<void>;
    /**
     * Helper wrapper that calls [[SrComponentStateHelpers]] copyState().
     */
    protected copyState(): S;
}
