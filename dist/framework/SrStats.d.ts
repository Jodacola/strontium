export default class Stats {
    private static pendingTimings;
    static start(token?: string): string;
    static stop(token: string, message: string, data?: any): void;
    static getStartTime(token: string): number;
    private static removeTiming(token);
}
