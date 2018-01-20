/// <reference types="react" />
import { IMessageHandler, SrAppMessage } from "../messaging/Messaging";
import { IUiInitializer } from "../config/Config";
export default class SrUi implements IMessageHandler {
    private resizeHandler;
    private overlayVisible;
    private initialized;
    private currentView;
    private overlayFading;
    private navigationHandlers;
    private lastViewType;
    private lastViewId;
    private lastQuery;
    private asyncTimeout;
    private defaultLocation;
    private basePath;
    private rootElement;
    private urlNavigationEnabled;
    private appTitle;
    private configurer;
    initialize(uiInit: IUiInitializer): void;
    handles(): string[];
    handlesLocal(): string[];
    receiveMessage(msg: SrAppMessage): void;
    appBasePath(): string;
    private configureUi(uiInit);
    private handleInitialization(success);
    private loadCurrentUrl();
    private getCurrentLocation(replacePrefix?);
    private setupInitalUi(uiInit);
    private setupHandlers(uiInit);
    private registerHandler(handler);
    private onAppLocationChanged(path, data?, title?, fromPop?);
    private getNavigationTarget(loc, data);
    private onWindowResized(e);
    isOverlayOpen(): boolean;
    private performNavigation(nav, data?, title?, fromPop?);
    private setLastViewInfo(type, id, query);
    updateQuery(query: string): void;
    private performNavigationChange(title, view, originalNav, fromPop?, isAsyncReplace?, onlyQueryUpdated?);
    changeView(view: JSX.Element, onlyQueryUpdated?: boolean): Promise<void>;
    private getDefaultLocation();
    navigate(appUrl: string, title?: string, data?: any): void;
    showOverlay(): Promise<void>;
    hideOverlay(): Promise<void>;
}
