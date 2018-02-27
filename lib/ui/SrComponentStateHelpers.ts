import SrUiComponent from "./SrUiComponent";
import Log from "../framework/Log";

export default class SrComponentStateHelpers<P, S> {
    private _component: SrUiComponent<P, S> = null;

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
        }
        Log.t(this, "Setting new state", state);
        this._component.setState(state);
    }

    /**
     * Merges the partial state object with a shallow copy of component's state
     * and calls sets via set.
     */
    public setPartial(obj: Partial<S>): void {
        Log.d(this, "Setting partial data on state", obj);
        var state = this.copyState();
        Object.assign(state, obj);
        this.set(state);
    }

    /**
     * Sets state (if mounted) and returns a promise for awaiting the setting
     * of the setState callback.
     */
    public setAsync(state: S): Promise<S> {
        if (!this._component.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
        }
        Log.t(this, "Setting new state", state);
        return new Promise(resolve => {
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
        var copy: any = {};
        for (var key in this._component.state) {
            if (this._component.state.hasOwnProperty(key)) {
                copy[key] = this._component.state[key];
            }
        }
        return copy as S;
    }
}