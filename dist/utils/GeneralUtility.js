import * as React from "react";
export default class GeneralUtility {
    static delay(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
    static errorList(initialMessage, otherMessages) {
        let items = [initialMessage];
        items = items.concat(otherMessages);
        return this.errorParagraphs(items);
    }
    static errorParagraphs(items) {
        items = items.filter((v) => { return (v !== null && v !== undefined); });
        let results = items.map((v, i) => { return React.createElement("p", { key: i }, v); });
        if (results.length === 0) {
            return null;
        }
        return results;
    }
    static decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
}
//# sourceMappingURL=GeneralUtility.js.map