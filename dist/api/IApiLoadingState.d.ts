import LoadStates from "./LoadStates";
export default interface IApiLoadingState {
    loadState: LoadStates;
    loadingMessage?: any;
    successMessage?: any;
    errorMessage?: any;
}
