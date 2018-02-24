import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ILoggerConfig from "./ILoggerConfig";
import ConfigElementTypes from "./ConfigElementTypes";
export default class LoggerConfig extends StrontiumAppConfigElement<ILoggerConfig> {
    elementType(): ConfigElementTypes;
    config(): any;
}
