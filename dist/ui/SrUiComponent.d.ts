/// <reference types="react" />
/// <reference types="jquery" />
/// <reference types="bootstrap" />
import * as React from "react";
import { SrServiceResponse } from "../api/API";
import { IMessageHandler, SrAppMessage } from "../messaging/Messaging";
declare abstract class SrUiComponent<P, S> extends React.Component<P, S> implements IMessageHandler {
    private resizeListener;
    private componentMounted;
    private deferHandlers;
    private elementRefs;
    private refHandlers;
    constructor(props: any);
    protected getRefHandler<T extends HTMLElement>(key: string): (ref: T) => void;
    protected getRef<T extends HTMLElement>(key: string): T;
    protected getJRef(key: string): JQuery;
    protected cleanUpRefs(): void;
    handles(): string[];
    protected getHandles(): string[];
    handlesLocal(): string[];
    protected getHandlesLocal(): string[];
    receiveMessage(msg: SrAppMessage): void;
    protected onAppMessage(msg: SrAppMessage): void;
    private registerHandlers();
    private unregisterHandlers();
    protected initialState(): S;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(props: P): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    protected onComponentWillMount(): void;
    protected onComponentMounted(): void;
    protected onComponentWillUnmount(): void;
    abstract performRender(): JSX.Element;
    protected mounted(): boolean;
    protected onNewProps(props: P): void;
    protected resizeCallback(): () => void;
    protected registerResizeHandler(): void;
    protected unregisterResizeHandler(): void;
    protected navigate(url: string, title?: string, data?: any, navOptions?: any): void;
    protected navigateOptions(navOptions: any): void;
    protected buildNavQuery(navOptions: any): string;
    protected localize(msg: string): string;
    protected resourceCreate(resource: any, data?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    protected resourceRead(resource: any, data?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    protected resourceUpdate(resource: any, data?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    protected resourceDelete(resource: any, data?: any, handler?: (r: SrServiceResponse) => void): Promise<SrServiceResponse>;
    private sendRequest(type, resource, data?, handler?);
    protected deferred(func: Function, time?: number, id?: string): void;
    protected set(state: S): void;
    protected setPartial(obj: Partial<S>): void;
    protected setAsync(state: S): Promise<S>;
    protected setPartialAsync(obj: Partial<S>): Promise<void>;
    protected copyState(): S;
    protected cancelDeferred(id: string): void;
    protected updateQuery(query: string): void;
    protected addQueryItem(query: string, key: string, value: string): string;
    protected classes(...classes: string[]): string;
    protected if(condition: boolean, className: string): string;
    /**
     * Returns a promise that resolves after the provided delay.
     * @param {Number} milliseconds The delay in milliseconds before the promise is resolved.
     */
    protected delay(milliseconds: number): Promise<void>;
    protected broadcast(message: string, data?: any): void;
}
export default SrUiComponent;
