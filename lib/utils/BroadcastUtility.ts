import { runtime } from "../framework/SrApp";

export function broadcast(message: string, data?: any) {
    runtime.messaging.broadcast(message, true, data);
}