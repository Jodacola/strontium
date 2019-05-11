import Log from "./Log";
import * as uuid from "uuid";

export default class Stats {
    private static pendingTimings: { [id: string]: number } = {};

    public static start(token?: string): string {
        token = token || uuid.v4();
        this.pendingTimings[token] = new Date().getTime();
        return token;
    }

    public static stop(token: string, message: string, data?: any): void {
        if (this.pendingTimings[token]) {
            var start: number = this.removeTiming(token);
            var end: number = new Date().getTime();
            var duration: number = end - start;
            Log.t(this, "Timed action", { token: token, message: message, duration: duration, data: data });
        }
    }

    public static getStartTime(token: string): number {
        return this.pendingTimings[token];
    }

    private static removeTiming(token: string): number {
        var val: number = this.pendingTimings[token];
        delete this.pendingTimings[token];
        return val;
    }
}
