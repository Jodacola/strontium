import { runtime } from "../framework/SrApp";
export function broadcast(message, data) {
    runtime.messaging.broadcast(message, true, data);
}
//# sourceMappingURL=BroadcastUtility.js.map