import StrontiumAppConfigElement from "./StrontiumAppConfigElement";
import ILoggerConfig from "./ILoggerConfig";
import ConfigElementTypes from "./ConfigElementTypes";

export default class LoggerConfig extends StrontiumAppConfigElement<ILoggerConfig> {
    static defaultProps: ILoggerConfig = {
        srConfigElementType: ConfigElementTypes.Logger
    };

    config(): any {
        return { loggingLevel: this.props.loggingLevel, logExclusions: this.props.logExclusions };
    }
}
