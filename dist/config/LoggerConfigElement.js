import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
class LoggerConfig extends StrontiumAppConfigElement {
    config() {
        return { loggingLevel: this.props.loggingLevel, logExclusions: this.props.logExclusions };
    }
}
LoggerConfig.defaultProps = {
    srConfigElementType: ConfigElementTypes.Logger
};
export default LoggerConfig;
//# sourceMappingURL=LoggerConfigElement.js.map