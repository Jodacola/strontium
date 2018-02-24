import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
import StrontiumApiConfig from "./StrontiumApiConfig";
export default class ApiConfigElement extends StrontiumAppConfigElement {
    config() {
        return new StrontiumApiConfig(this.props.connection);
    }
}
ApiConfigElement.defaultProps = {
    srConfigElementType: ConfigElementTypes.Api
};
//# sourceMappingURL=ApiConfigElement.js.map