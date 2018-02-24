import ConfigElementTypes from "./ConfigElementTypes";
export default interface IStrontiumAppConfigElement {
    elementType: () => ConfigElementTypes;
}
