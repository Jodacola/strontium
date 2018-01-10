import Log from "../framework/Log";

export default class EnvironmentUtility {
    private static checked: string[] = [];

    private static alreadyChecked(key: string): boolean {
        return this.checked.indexOf(key) !== -1;
    }

    private static addChecked(key: string) {
        this.checked.push(key);
    }

    private static updateOnFirst(key: string, loaded: boolean): void {
        if (!this.alreadyChecked(key)) {
            this.addChecked(key);
            if (!loaded) {
                console.warn(`Library not loaded: ${key}`);
            }
        }
    }

    public static jqueryLoaded(): boolean {
        Log.d(this, 'Checking if jQuery is loaded');

        let loaded = !!(window as any).jQuery;
        this.updateOnFirst('jQuery', loaded);
        return loaded;
    }

    public static bootstrapLoaded(): boolean {
        Log.d(this, 'Checking if Bootstrap is loaded');

        let jquery = this.jqueryLoaded();
        let loaded = jquery && (typeof $().emulateTransitionEnd == 'function');
        this.updateOnFirst('Bootstrap', loaded);
        return loaded;
    }
}
