import * as React from "react";
import ConfigElementTypes from "./ConfigElementTypes";

export interface IConfigElement {
    srConfigElementType?: ConfigElementTypes,
    configure?: (type: ConfigElementTypes, config: any) => void
}

export abstract class StrontiumAppConfigElement<P extends IConfigElement> extends React.Component<P, {}> {
    constructor(props: P) {
        super(props);
    }

    abstract config(): any;

    componentDidMount() {
        this.props.configure(this.props.srConfigElementType, this.config());
    }

    render(): React.ReactNode {
        return this.props.children || [];
    }
}