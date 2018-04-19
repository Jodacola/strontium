import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
export default class ApiConfigElement extends StrontiumAppConfigElement {
    config() {
        let conn = this.props.connection;
        conn.name = this.props.name;
        return conn;
    }
}
ApiConfigElement.defaultProps = {
    srConfigElementType: ConfigElementTypes.Api
};
//# sourceMappingURL=ApiConfigElement.js.map