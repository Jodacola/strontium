import SrUiComponent from "./SrUiComponent";
export default class SrComponentStateHelpers<P, S> {
    private _component;
    constructor(component: SrUiComponent<P, S>);
    /**
     * Sets the state of the component, only if the component is currently
     * indicated as being mounted.
     */
    set(state: S): void;
    /**
     * Merges the partial state object with a shallow copy of component's state
     * and calls sets via set.
     */
    setPartial(obj: Partial<S>): void;
    /**
     * Sets state (if mounted) and returns a promise for awaiting the setting
     * of the setState callback.
     */
    setAsync(state: S): Promise<S>;
    /**
     * Merges the partial state object with a shallow copy of component's state
     * and calls sets via setAsync.  Awaitable.
     */
    setPartialAsync(obj: Partial<S>): Promise<void>;
    /**
     * Performs a shallow copy of the component's state.
     */
    copyState(): S;
}
