import SrUiComponent from "./SrUiComponent";
import Log from "../framework/Log";

export default class SrComponentStateHelpers<P, S> {
    private _component: SrUiComponent<P, S> = null;
    private _batch: Partial<S> = {};
    private _batchHandle: number = undefined;

    constructor(component: SrUiComponent<P, S>) {
        this._component = component;
    }

    /**
     * Sets the state of the component, only if the component is currently
     * indicated as being mounted.
     */
    public set(state: S): void {
        if (!this._component.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
            return;
        }
        Log.t(this, "Setting new state", state);
        this._component.setState(state);
    }

    /**
     * Merges the partial state object with a shallow copy of component's state
     * and calls sets via set.
     * 
     * Will batch setPartial updates within same event loop iteration if `batched`
     * is true (default).
     */
    public setPartial(obj: Partial<S>, batched: boolean = true): void {
        Log.d(this, "Setting partial data on state", obj);
        if (batched) {
            this._batch = { ...this._batch, ...obj };
            if (this._batchHandle !== undefined) {
                window.clearTimeout(this._batchHandle);
            }
            this._batchHandle = window.setTimeout(() => {
                var state = this.copyState();
                Object.assign(state, this._batch);
                this._batch = {};
                this.set(state);
            }, 0);
        } else {
            var state = this.copyState();
            Object.assign(state, obj);
            this.set(state);
        }
    }

    /**
     * Sets state (if mounted) and returns a promise for awaiting the setting
     * of the setState callback.
     */
    public setAsync(state: S): Promise<S> {
        if (!this._component.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
            return new Promise<S>(resolve => resolve({} as S));
        }
        Log.t(this, "Setting new state", state);
        return new Promise<S>(resolve => {
            this._component.setState(state,
                () => {
                    resolve(state);
                });
        });
    }

    /**
     * Merges the partial state object with a shallow copy of component's state
     * and calls sets via setAsync.  Awaitable.
     */
    public async setPartialAsync(obj: Partial<S>) {
        Log.d(this, "Setting partial data on state", obj);
        var state = this.copyState();
        Object.assign(state, obj);
        await this.setAsync(state);
    }

    /**
     * Performs a shallow copy of the component's state.
     */
    public copyState(): S {
        if (!this._component.state) {
            return null;
        }

        return Object.assign({}, this._component.state) as S;
    }
}