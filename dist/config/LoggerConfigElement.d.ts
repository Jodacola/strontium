import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ILoggerConfig from "./ILoggerConfig";
export default class LoggerConfig extends StrontiumAppConfigElement<ILoggerConfig> {
    static defaultProps: ILoggerConfig;
    config(): any;
}
