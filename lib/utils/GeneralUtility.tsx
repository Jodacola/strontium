import * as React from "react";

export default class GeneralUtility {
    public static delay(milliseconds: number): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    public static errorList(initialMessage: string, otherMessages: string[]) {
        let items = [initialMessage];
        items = items.concat(otherMessages);
        return this.errorParagraphs(items);
    }

    public static errorParagraphs(items: string[]) {
        items = items.filter((v) => { return (v !== null && v !== undefined); });
        let results = items.map((v, i) => { return <p key={i}>{v}</p>; });
        if (results.length === 0) {
            return null;
        }
        return results;
    }

    public static decodeHtml(html): string {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
}
