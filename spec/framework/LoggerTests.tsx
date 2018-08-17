import { Logger, LogLevel, IErrorReporter, runtime } from '../../lib/lib';

describe('logger', () => {
    test('generates default logger', () => {
        const logger = Logger.getLogger();
        expect(logger.level).toBe(LogLevel.Error);
    });

    test('logs LogLevel.Error to console when logger accepts Error or lower', () => {
        (global.console as any) = {
            warn: jest.fn(),
            error: jest.fn(),
            log: jest.fn()
        };

        [LogLevel.Trace, LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error].forEach((l, i) => {
            let logger = new Logger(l);
            logger.error({}, 'Error', {});
            expect(global.console.error).toHaveBeenCalledTimes(i + 1);
        });
    });

    test('never logs to console when LogLevel.None', () => {
        (global.console as any) = {
            warn: jest.fn(),
            error: jest.fn(),
            log: jest.fn()
        };

        let logger = new Logger(LogLevel.None);
        [LogLevel.Trace, LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.None].forEach((l) => {
            logger.log(l, {}, "Message", {});
            expect(global.console.log).toHaveBeenCalledTimes(0);
            expect(global.console.warn).toHaveBeenCalledTimes(0);
            expect(global.console.error).toHaveBeenCalledTimes(0);
        });
    });

    test('log filters prevent specific log output', () => {
        (global.console as any) = {
            warn: jest.fn(),
            error: jest.fn(),
            log: jest.fn()
        };

        let contextClass = class NewClass { constructor() { } };
        let contextClass2 = class NewClass2 { constructor() { } };

        let logger = new Logger(LogLevel.Info, ['NewClass']);
        logger.info(new contextClass(), "Message", {});
        expect(global.console.log).toHaveBeenCalledTimes(0);
        expect(global.console.warn).toHaveBeenCalledTimes(0);
        expect(global.console.error).toHaveBeenCalledTimes(0);
        logger.info(new contextClass2(), "Message", {});
        expect(global.console.log).toHaveBeenCalledTimes(1);
        expect(global.console.warn).toHaveBeenCalledTimes(0);
        expect(global.console.error).toHaveBeenCalledTimes(0);
    });

    test('context is properly filtered', () => {
        let logger = new Logger(LogLevel.Info, ['Context1']) as any;
        expect(logger.isContextFilteredOut('Context2')).toBe(false);
        expect(logger.isContextFilteredOut('Context1')).toBe(true);
    });

    test('context name properly determined', () => {
        let logger = new Logger(LogLevel.Info) as any;
        expect(logger.getContextName(undefined)).toBe('Unknown');
        let contextClass = class NewClass { constructor() { } };
        expect(logger.getContextName(new contextClass())).toBe('NewClass');
    });

    test('message builds in expected format (no context, no data, no message)', () => {
        let logger = new Logger(LogLevel.Info) as any;
        let time = new Date().getTime();
        let message = logger.buildMessage(time, LogLevel.Info, null, null, null);
        expect(message).toBe(`[INFO] [${time}]`)
    });

    test('message builds in expected format (no context, no data)', () => {
        let logger = new Logger(LogLevel.Info) as any;
        let time = new Date().getTime();
        let message = logger.buildMessage(time, LogLevel.Info, null, null, 'A message');
        expect(message).toBe(`[INFO] [${time}] A message`)
    });

    test('message builds in expected format (no data)', () => {
        let logger = new Logger(LogLevel.Info) as any;
        let time = new Date().getTime();
        let message = logger.buildMessage(time, LogLevel.Info, null, 'Context', 'A message');
        expect(message).toBe(`[INFO] [${time}] Context - A message`)
    });

    test('message builds in expected format', () => {
        let logger = new Logger(LogLevel.Info) as any;
        let time = new Date().getTime();
        let message = logger.buildMessage(time, LogLevel.Info, { someData: 'someValue' }, 'Context', 'A message');
        expect(message).toBe(`[INFO] [${time}] Context - A message - {"someData":"someValue"}`)
    });

    test('error reporter not called when unset', () => {
        let logger = new Logger(LogLevel.Info) as any;
        logger.reportError('context', 'msg', 'data');
    });

    test('error reporter called with empty error', () => {
        let report: IErrorReporter = { report: jest.fn() };
        let logger = new Logger(LogLevel.Info, null, report) as any;
        logger.reportError('context', 'msg', 'data');
        expect(report.report).toHaveBeenCalledWith('context - msg', new Error(), 'data');
        expect(report.report).toHaveBeenCalledTimes(1);
    });

    test('error reporter called with supplied error', () => {
        let report: IErrorReporter = { report: jest.fn() };
        let logger = new Logger(LogLevel.Info, null, report) as any;
        let error = new Error('a message');
        logger.reportError('context', 'msg', error);
        expect(report.report).toHaveBeenCalledWith('context - msg', error, error);
        expect(report.report).toHaveBeenCalledTimes(1);
    });

    test('error reporter called with data exception', () => {
        let report: IErrorReporter = { report: jest.fn() };
        let logger = new Logger(LogLevel.Info, null, report) as any;
        let error = new Error('a message');
        let data = { exception: error };
        logger.reportError('context', 'msg', data);
        expect(report.report).toHaveBeenCalledWith('context - msg', error, data);
        expect(report.report).toHaveBeenCalledTimes(1);
    });

    test('error reporter called when error log called', () => {
        let report: IErrorReporter = { report: jest.fn() };
        let logger = new Logger(LogLevel.Info, null, report) as any;
        let error = new Error('a message');
        let data = { exception: error };
        logger.error(null, 'msg', data);
        expect(report.report).toHaveBeenCalledWith('Unknown - msg', error, data);
        expect(report.report).toHaveBeenCalledTimes(1);
    });

    test('error reporter not called when info log called', () => {
        let report: IErrorReporter = { report: jest.fn() };
        let logger = new Logger(LogLevel.Info, null, report) as any;
        let error = new Error('a message');
        let data = { exception: error };
        logger.info(null, 'msg', data);
        expect(report.report).toHaveBeenCalledTimes(0);
    });

    test('runtime not ready when configs unset', () => {
        expect((Logger as any).runtimeReady()).toBe(false);
    });

    test('logger rebuilt when runtime not ready', () => {
        let logger1 = Logger.getLogger();
        let logger2 = Logger.getLogger();
        expect(logger1 === logger2).toBe(false);
    });

    test('runtime ready when config set', () => {
        let report: IErrorReporter = { report: jest.fn() };
        (runtime.config as any) = {
            loggingLevel: LogLevel.Trace,
            logFilter: ['Filter'],
            errorReporter: () => report
        };
        expect((Logger as any).runtimeReady()).toBe(true);
    });

    test('logger same when runtime ready', () => {
        let logger1 = Logger.getLogger();
        let logger2 = Logger.getLogger();
        expect(logger1 === logger2).toBe(true);
    });

    test('logger gets runtime config', () => {
        let logger = Logger.getLogger();
        expect(logger.level).toBe(LogLevel.Trace);
        expect(logger.logFilter).toContain('Filter');
        expect(logger.reporter).toBe(runtime.config.errorReporter());
    });
});
