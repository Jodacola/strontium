import { runtime } from "../framework/SrApp";

export function navigate(url: string): void {
    runtime.ui.navigate(url);
};