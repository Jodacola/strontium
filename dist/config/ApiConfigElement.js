import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
class ApiConfigElement extends StrontiumAppConfigElement {
    config() {
        let conn = this.props.connection;
        if (conn) {
            conn.name = this.props.name;
        }
        return conn;
    }
}
ApiConfigElement.defaultProps = {
    srConfigElementType: ConfigElementTypes.Api
};
export default ApiConfigElement;
//# sourceMappingURL=ApiConfigElement.js.map