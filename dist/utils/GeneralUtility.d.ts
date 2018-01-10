/// <reference types="react" />
export default class GeneralUtility {
    static delay(milliseconds: number): Promise<void>;
    static errorList(initialMessage: string, otherMessages: string[]): JSX.Element[];
    static errorParagraphs(items: string[]): JSX.Element[];
    static decodeHtml(html: any): string;
}
