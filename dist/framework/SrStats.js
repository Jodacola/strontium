import Log from "./Log";
import * as uuid from "uuid";
class Stats {
    static start(token) {
        token = token || uuid.v4();
        this.pendingTimings[token] = new Date().getTime();
        return token;
    }
    static stop(token, message, data) {
        if (this.pendingTimings[token]) {
            var start = this.removeTiming(token);
            var end = new Date().getTime();
            var duration = end - start;
            Log.t(this, "Timed action", { token: token, message: message, duration: duration, data: data });
        }
    }
    static getStartTime(token) {
        return this.pendingTimings[token];
    }
    static removeTiming(token) {
        var val = this.pendingTimings[token];
        delete this.pendingTimings[token];
        return val;
    }
}
Stats.pendingTimings = {};
export default Stats;
//# sourceMappingURL=SrStats.js.map