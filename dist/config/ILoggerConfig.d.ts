import { LogLevel } from "../framework/Log";
import { IConfigElement } from "./StrontiumAppConfigElement";
export default interface ILoggerConfig extends IConfigElement {
    loggingLevel?: LogLevel;
    logExclusions?: string[];
}
