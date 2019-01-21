import * as React from "react";
import ConfigElementTypes from "./ConfigElementTypes";
export interface IConfigElement {
    srConfigElementType?: ConfigElementTypes;
    configure?: (type: ConfigElementTypes, config: any) => void;
}
export default abstract class StrontiumAppConfigElement<P extends IConfigElement> extends React.Component<P, {}> {
    constructor(props: P);
    abstract config(): any;
    componentDidMount(): void;
    render(): React.ReactNode;
}
