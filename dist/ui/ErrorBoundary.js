import UiC from "./SrUiComponent";
import Log from "../framework/Log";
export default class ErrorBoundary extends UiC {
    initialState() {
        return { hasError: false, error: null, info: null };
    }
    componentDidCatch(error, info) {
        this.setState({ hasError: true, error: error, info: info });
        Log.e(this, 'Error within component', { error: error, info: info });
    }
    performRender() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map