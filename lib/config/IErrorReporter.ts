export default interface IErrorReporter {
    report: (message: string, error: Error, data: any) => void;
}
