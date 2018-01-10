import SrUiComponent from "./SrUiComponent";
import { LoadStates } from "../api/API";
import { GeneralUtility } from "../utils/Utils";
export default class SrApiUiComponent extends SrUiComponent {
    isLoading() {
        return this.state && this.state.loadState === LoadStates.Loading;
    }
    isLoaded() {
        return this.state && this.state.loadState === LoadStates.Succeeded;
    }
    trySetApiLoading(loadMsg) {
        if (this.isLoading()) {
            return false;
        }
        this.setApiLoading(loadMsg);
        return true;
    }
    setApiLoading(msg) {
        var newState = this.copyState();
        newState.loadState = LoadStates.Loading;
        newState.loadingMessage = msg;
        this.setState(newState);
    }
    setApiSuccess(msg = null) {
        var newState = this.copyState();
        newState.loadState = LoadStates.Succeeded;
        newState.successMessage = msg;
        this.setState(newState);
    }
    setApiError(msg = null, errors = []) {
        var newState = this.copyState();
        newState.loadState = LoadStates.Failed;
        newState.errorMessage = GeneralUtility.errorList(msg, errors);
        this.setState(newState);
    }
}
//# sourceMappingURL=SrApiUiComponent.js.map