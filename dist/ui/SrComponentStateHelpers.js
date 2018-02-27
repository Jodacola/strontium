var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Log from "../framework/Log";
export default class SrComponentStateHelpers {
    constructor(component) {
        this._component = null;
        this._component = component;
    }
    /**
     * Sets the state of the component, only if the component is currently
     * indicated as being mounted.
     */
    set(state) {
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
    setPartial(obj) {
        Log.d(this, "Setting partial data on state", obj);
        var state = this.copyState();
        Object.assign(state, obj);
        this.set(state);
    }
    /**
     * Sets state (if mounted) and returns a promise for awaiting the setting
     * of the setState callback.
     */
    setAsync(state) {
        if (!this._component.mounted()) {
            Log.w(this, "State setting while not mounted; ignoring.", state);
        }
        Log.t(this, "Setting new state", state);
        return new Promise(resolve => {
            this._component.setState(state, () => {
                resolve(state);
            });
        });
    }
    /**
     * Merges the partial state object with a shallow copy of component's state
     * and calls sets via setAsync.  Awaitable.
     */
    setPartialAsync(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            Log.d(this, "Setting partial data on state", obj);
            var state = this.copyState();
            Object.assign(state, obj);
            yield this.setAsync(state);
        });
    }
    /**
     * Performs a shallow copy of the component's state.
     */
    copyState() {
        if (!this._component.state) {
            return null;
        }
        var copy = {};
        for (var key in this._component.state) {
            if (this._component.state.hasOwnProperty(key)) {
                copy[key] = this._component.state[key];
            }
        }
        return copy;
    }
}
//# sourceMappingURL=SrComponentStateHelpers.js.map