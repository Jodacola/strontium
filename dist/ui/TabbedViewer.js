import * as React from "react";
import UiC from "./SrUiComponent";
import Log from "../framework/Log";
import Clear from "./Clear";
import Animated from "./Animated";
export default class TabbedViewer extends UiC {
    onComponentMounted() {
        this.checkValidTab();
    }
    onNewProps(props) {
        this.checkValidTab(props.currentSelection);
    }
    checkValidTab(id = null) {
        if (!this.validId(id || this.props.currentSelection)) {
            if (this.props.tabs && this.props.tabs.length > 0) {
                this.tabSelected(this.props.tabs[0].id);
            }
        }
    }
    performRender() {
        return (React.createElement("div", { className: this.classes("tabbed-viewer", this.props.className) },
            React.createElement("ul", { className: this.classes("nav nav-tabs", this.props.className) }, this.props.tabs.filter((t) => { return !t.hidden; }).map((t, i) => { return this.tabElement(t, i); })),
            React.createElement("div", { className: "tabbed-content" }, this.tabContent()),
            React.createElement(Clear, null)));
    }
    validId(id) {
        return (this.props.tabs.filter((t) => { return t.id === id; }).length > 0);
    }
    isId(id) {
        return id === this.props.currentSelection;
    }
    tabElement(tab, index) {
        return (React.createElement("li", { key: index + "-" + tab.id, role: "presentation", className: this.isId(tab.id) ? "active" : null },
            React.createElement("a", { onClick: () => { this.tabSelected(tab.id); } }, tab.title)));
    }
    tabSelected(id) {
        if (id === this.props.currentSelection) {
            return;
        }
        Log.t(this, "Tab selected", { id: id });
        this.props.tabSelected(id);
    }
    tabContent() {
        const tab = this.props.tabs.filter((t) => { return this.isId(t.id); })[0];
        if (tab) {
            return React.createElement(Animated, { in: true, leave: false, direction: "top" },
                React.createElement("div", { key: this.props.currentSelection }, tab.content));
        }
        return null;
    }
}
//# sourceMappingURL=TabbedViewer.js.map