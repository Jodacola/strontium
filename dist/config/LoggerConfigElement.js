import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
export default class LoggerConfig extends StrontiumAppConfigElement {
    config() {
        return { loggingLevel: this.props.loggingLevel, logExclusions: this.props.logExclusions };
    }
}
LoggerConfig.defaultProps = {
    srConfigElementType: ConfigElementTypes.Logger
};
//# sourceMappingURL=LoggerConfigElement.js.map