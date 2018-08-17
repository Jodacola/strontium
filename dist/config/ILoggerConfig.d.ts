import { IConfigElement } from "./StrontiumAppConfigElement";
import LogLevel from "../framework/LogLevel";
export default interface ILoggerConfig extends IConfigElement {
    loggingLevel?: LogLevel;
    logExclusions?: string[];
}
