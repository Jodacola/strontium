interface IErrorReporter {
    report: (message: string, error: Error, data: any) => void;
}

export default IErrorReporter;