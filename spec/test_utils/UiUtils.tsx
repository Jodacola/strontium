import React from "react";
import SrUiComponent from "../../lib/ui/SrUiComponent";
import { StrontiumApp, LoggerConfigElement, LogLevel, ServicesConfigElement, UiConfigElement, RouteConfigElement, runtime, ServiceConfigElement, CommonMessages, IAppService, SrAppMessage } from "../../lib/lib";
import {render, screen} from '@testing-library/react'

export const origTimeout = window.setTimeout;
export const origAddEventListener = window.addEventListener;

export class BareComp extends SrUiComponent<{}, {}>{
    performRender() {
        return <div className="test-component">
        </div>;
    }
}

export class WithInitialStateComp extends SrUiComponent<{ numProp: number, strProp: string }, { numState: number, strState: string }>{
    initialState() {
        return { numState: this.props.numProp, strState: this.props.strProp };
    }

    performRender() {
        return <div role="test-component" className="test-component">
            <p ref={this.setRef("elementRef")} />
            <p role="test-num-value" className="test-num-value">{this.state.numState}</p>
            <p role="test-str-value" className="test-str-value">{this.state.strState}</p>
        </div>;
    }
}

export class WithHandlesComp extends SrUiComponent<{ numProp: number, strProp: string }, { numState: number, strState: string }>{
    initialState() {
        return { numState: this.props.numProp, strState: this.props.strProp };
    }

    public customHandles: string[] = ["a handle"];

    getHandles() {
        return this.customHandles;
    }

    performRender() {
        return <div className="test-component">
            <p ref={this.setRef("elementRef")} />
            <p className="test-num-value">{this.state.numState}</p>
            <p className="test-str-value">{this.state.strState}</p>
        </div>;
    }
}

export const delay = function (milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        origTimeout(resolve, milliseconds);
    });
}

class StartupService implements IAppService {
    initialize(): void {
    }

    handles(): string[] { return [CommonMessages.AppReady]; }

    receiveMessage(msg: SrAppMessage): void {
        runtime.messaging.broadcast(CommonMessages.AppLaunch);
    }
}


export const setupRuntime = async () => {
    render(<StrontiumApp>
        <LoggerConfigElement loggingLevel={LogLevel.Error} />
        <ServicesConfigElement>
            <ServiceConfigElement id="startupService" service={new StartupService()} />
        </ServicesConfigElement>
        <UiConfigElement urlNavigationEnabled navigateOnQueryChanges appTitle="Test App" basePath="app" defaultLocation="test" rootElement="app-content" internalRenderer={(elem) => { }}>
            <RouteConfigElement title="Make a new team" route="test" view={d => <div id="test-view" />} />
        </UiConfigElement>
    </StrontiumApp>);

    for (var i = 0; i < 50; i++) {
        await delay(100);
        if (runtime.ui.initialized()) {
            return;
        }
    }
}