/// <reference types="react" />
import * as React from "react";
import { IMessageHandler, SrAppMessage } from "../messaging/Messaging";
declare abstract class SrUiComponent<P, S> extends React.Component<P, S> implements IMessageHandler {
    private stateHelpers;
    private resizeListener;
    private componentMounted;
    private deferHandlers;
    private elementRefs;
    private refHandlers;
    constructor(props: any);
    protected getRef<T extends HTMLElement>(key: string): T;
    handles(): string[];
    protected getHandles(): string[];
    receiveMessage(msg: SrAppMessage): void;
    protected onAppMessage(msg: SrAppMessage): void;
    private registerHandlers();
    private unregisterHandlers();
    protected initialState(): S;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(props: P): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    protected onComponentWillMount(): void;
    protected onComponentMounted(): void;
    protected onComponentWillUnmount(): void;
    abstract performRender(): React.ReactNode;
    mounted(): boolean;
    protected onNewProps(props: P): void;
    protected resizeCallback(): () => void;
    protected registerResizeHandler(): void;
    protected unregisterResizeHandler(): void;
    protected navigate(url: string, title?: string, data?: any, navOptions?: any): void;
    protected navigateOptions(navOptions: any): void;
    protected buildNavQuery(navOptions: any): string;
    protected localize(msg: string): string;
    protected deferred(func: Function, time?: number, id?: string): void;
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
    protected cancelDeferred(id: string): void;
    protected updateQuery(query: string): void;
    protected addQueryItem(query: string, key: string, value: string): string;
    protected classes(...classes: string[]): string;
    protected broadcast(message: string, data?: any): void;
}
export default SrUiComponent;
