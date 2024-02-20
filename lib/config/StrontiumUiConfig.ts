import { IUiInitializer, INavigationHandler } from "../lib";

export default class StrontiumUiConfig implements IUiInitializer {
    private _defaultLocation: string;
    private _basePath: string;
    private _rootElement: string;
    private _urlNavEnabled: boolean;
    private _navigateOnQueryChange: boolean;
    private _appTitle: string;
    private _navHandlers: INavigationHandler[];
    private _appReady: () => void;
    private _appInitFailed: () => void;
    private _appInitializing: () => void;
    private _containerElement: React.ReactNode;
    private _footerElement: React.ReactNode | React.ReactNode[];
    private _headerElement: React.ReactNode | React.ReactNode[];
    private _viewRenderer: (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any>;
    private _internalRenderer?: (element: React.ReactElement<any>) => void;

    constructor(options: {
        defaultLocation: string,
        basePath: string,
        rootElement: string,
        urlNavEnabled: boolean,
        navigateOnQueryChange: boolean,
        appTitle: string,
        appReady: () => void,
        appInitFailed: () => void,
        appInitializing: () => void,
        navHandlers: INavigationHandler[],
        headerElement: React.ReactNode | React.ReactNode[],
        footerElement: React.ReactNode | React.ReactNode[],
        viewRenderer: (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any>,
        containerElement: React.ReactNode,
        internalRenderer?: (element: React.ReactElement<any>) => void
    }) {
        this._defaultLocation = options.defaultLocation;
        this._basePath = options.basePath;
        this._rootElement = options.rootElement;
        this._urlNavEnabled = options.urlNavEnabled === true;
        this._navigateOnQueryChange = options.navigateOnQueryChange === true;
        this._appTitle = options.appTitle;
        this._appReady = options.appReady;
        this._appInitializing = options.appInitializing;
        this._appInitFailed = options.appInitFailed;
        this._navHandlers = options.navHandlers;
        this._footerElement = options.footerElement;
        this._headerElement = options.headerElement;
        this._viewRenderer = options.viewRenderer;
        this._containerElement = options.containerElement;
        this._internalRenderer = options.internalRenderer;
    }

    public defaultLocation(): string {
        return this._defaultLocation;
    }

    public basePath(): string {
        return this._basePath;
    }

    public rootElement(): string {
        return this._rootElement;
    }

    public urlNavigationEnabled(): boolean {
        return this._urlNavEnabled;
    }

    public navigateOnQueryChange(): boolean {
        return this._navigateOnQueryChange;
    }

    public appInitializing(): void {
        if (this._appInitializing) {
            this._appInitializing();
        }
    }

    public appReady(): void {
        if (this._appReady) {
            this._appReady();
        }
    }

    public appInitFailed(): void {
        if (this._appInitFailed) {
            this._appInitFailed();
        }
    }

    public navigationHandlers(): INavigationHandler[] {
        return this._navHandlers ?? [];
    }

    public appTitle(): string {
        return this._appTitle;
    }

    public footerElement(): React.ReactNode | React.ReactNode[] {
        return this._footerElement;
    }

    public headerElement(): React.ReactNode | React.ReactNode[] {
        return this._headerElement;
    }

    public containerElement(): React.ReactNode {
        return this._containerElement;
    }

    public viewRenderer(): (view: React.ReactNode, headerElement: React.ReactNode | React.ReactNode[], footerElement: React.ReactNode | React.ReactNode[]) => React.ReactElement<any> {
        return this._viewRenderer;
    }

    public internalRenderer(): (element: React.ReactElement<any>) => void {
        return this._internalRenderer!;
    }
}