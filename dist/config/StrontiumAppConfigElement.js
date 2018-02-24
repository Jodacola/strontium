import * as React from "react";
export class StrontiumAppConfigElement extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.configure(this.props.srConfigElementType, this.config());
    }
    render() {
        return this.props.children || [];
    }
}
//# sourceMappingURL=StrontiumAppConfigElement.js.map