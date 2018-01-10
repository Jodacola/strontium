import Log from "../framework/Log";
export default class EnvironmentUtility {
    static alreadyChecked(key) {
        return this.checked.indexOf(key) !== -1;
    }
    static addChecked(key) {
        this.checked.push(key);
    }
    static updateOnFirst(key, loaded) {
        if (!this.alreadyChecked(key)) {
            this.addChecked(key);
            if (!loaded) {
                console.warn(`Library not loaded: ${key}`);
            }
        }
    }
    static jqueryLoaded() {
        Log.d(this, 'Checking if jQuery is loaded');
        let loaded = !!window.jQuery;
        this.updateOnFirst('jQuery', loaded);
        return loaded;
    }
    static bootstrapLoaded() {
        Log.d(this, 'Checking if Bootstrap is loaded');
        let jquery = this.jqueryLoaded();
        let loaded = jquery && (typeof $().emulateTransitionEnd == 'function');
        this.updateOnFirst('Bootstrap', loaded);
        return loaded;
    }
}
EnvironmentUtility.checked = [];
//# sourceMappingURL=EnvironmentUtility.js.map