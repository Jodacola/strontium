import LoadStates from "./LoadStates";
interface IApiLoadingState {
    loadState: LoadStates;
    loadingMessage?: any;
    successMessage?: any;
    errorMessage?: any;
}
export default IApiLoadingState;
