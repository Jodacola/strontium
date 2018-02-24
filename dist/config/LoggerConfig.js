import { StrontiumAppConfigElement } from "./StrontiumAppConfigElement";
import ConfigElementTypes from "./ConfigElementTypes";
export default class LoggerConfig extends StrontiumAppConfigElement {
    elementType() {
        return ConfigElementTypes.Logger;
    }
    config() {
        return this.props;
    }
}
//# sourceMappingURL=LoggerConfig.js.map