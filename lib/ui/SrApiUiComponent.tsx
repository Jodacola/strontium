import SrUiComponent from "./SrUiComponent";
import { IApiLoadingState, LoadStates } from "../api/API";
import { GeneralUtility } from "../utils/Utils";

export default abstract class SrApiUiComponent<P, SApi extends IApiLoadingState> extends SrUiComponent<P, SApi>{
    protected isLoading(): boolean {
        return this.state && this.state.loadState === LoadStates.Loading;
    }

    protected isLoaded(): boolean {
        return this.state && this.state.loadState === LoadStates.Succeeded;
    }

    protected trySetApiLoading(loadMsg: string): boolean {
        if (this.isLoading()) {
            return false;
        }

        this.setApiLoading(loadMsg);
        return true;
    }

    protected setApiLoading(msg: string) {
        var newState = this.copyState();
        newState.loadState = LoadStates.Loading;
        newState.loadingMessage = msg;
        this.setState(newState);
    }

    protected setApiSuccess(msg: any = null) {
        var newState = this.copyState();
        newState.loadState = LoadStates.Succeeded;
        newState.successMessage = msg;
        this.setState(newState);
    }

    protected setApiError(msg: any = null, errors: string[] = []) {
        var newState = this.copyState();
        newState.loadState = LoadStates.Failed;
        newState.errorMessage = GeneralUtility.errorList(msg, errors);
        this.setState(newState);
    }
}
