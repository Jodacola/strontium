import * as React from "react";
import UiC from "./SrUiComponent";
import ITabConfig from "./ITabConfig";
import Log from "../framework/Log";
import Clear from "./Clear";
import Animated from "./Animated";

export default class TabbedViewer extends UiC<{ tabSelected: (id: string) => void, tabs: ITabConfig[], currentSelection: string, className?: string }, {}> {
    onComponentMounted(): void {
        this.checkValidTab();
    }

    onNewProps(props: { tabSelected: (id: string) => void, tabs: ITabConfig[], currentSelection: string, className?: string }): void {
        this.checkValidTab(props.currentSelection);
    }

    checkValidTab(id: string = null) {
        if (!this.validId(id || this.props.currentSelection)) {
            if (this.props.tabs && this.props.tabs.length > 0) {
                this.tabSelected(this.props.tabs[0].id);
            }
        }
    }

    performRender() {
        return (
            <div className={this.classes("tabbed-viewer", this.props.className)}>
                <ul className={this.classes("nav nav-tabs", this.props.className)}>
                    {this.props.tabs.filter((t) => { return !t.hidden; }).map((t, i) => { return this.tabElement(t, i); })}
                </ul>
                <div className="tabbed-content">
                    {this.tabContent()}
                </div>
                <Clear />
            </div>);
    }

    validId(id: string) {
        return (this.props.tabs.filter((t) => { return t.id === id; }).length > 0);
    }

    isId(id) {
        return id === this.props.currentSelection;
    }

    tabElement(tab: ITabConfig, index: number) {
        return (
            <li key={index + "-" + tab.id} role="presentation" className={this.isId(tab.id) ? "active" : null}>
                <a onClick={() => { this.tabSelected(tab.id); }}>{tab.title}</a>
            </li>
        );
    }

    tabSelected(id: string) {
        if (id === this.props.currentSelection) {
            return;
        }
        Log.t(this, "Tab selected", { id: id });
        this.props.tabSelected(id);
    }

    tabContent() {
        const tab = this.props.tabs.filter((t) => { return this.isId(t.id); })[0];
        if (tab) {
            return <Animated leave={false} direction="top"><div key={this.props.currentSelection}>{tab.content}</div></Animated>;
        }
        return null;
    }
}