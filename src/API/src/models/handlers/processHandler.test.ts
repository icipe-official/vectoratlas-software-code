import { runProcess } from './processHandler';
import { spawn } from 'child_process';

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('processHandler', () => {
  let mockSpawn;
  let eventHandlers;
  let mockLogger;
  const handleError = jest.fn();
  const handleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    eventHandlers = {};

    mockSpawn = {
      pid: '123',
      stdout: {
        on: jest.fn((name, handler) => (eventHandlers.stdout = handler)),
      },
      stderr: {
        on: jest.fn((name, handler) => (eventHandlers.stderr = handler)),
      },
      on: jest.fn((name, handler) => (eventHandlers[name] = handler)),
    };

    (spawn as jest.Mock).mockReturnValue(mockSpawn);

    mockLogger = {
      log: jest.fn(),
    };
  });

  it('pipes stdout and stderr back to logger', () => {
    runProcess(
      'a script',
      ['arg1', 'arg2'],
      mockLogger,
      handleError,
      handleClose,
    );
    eventHandlers.stdout('some data out');

    expect(mockLogger.log).toHaveBeenCalledWith('Process id: 123');
    expect(mockLogger.log).toHaveBeenCalledWith('stdout: some data out');

    eventHandlers.stderr('simulate an error');

    expect(mockLogger.log).toHaveBeenCalledWith('stderr: simulate an error');
  });

  it('calls the error handler when there is an error', () => {
    runProcess(
      'a script',
      ['arg1', 'arg2'],
      mockLogger,
      handleError,
      handleClose,
    );
    eventHandlers.error({ message: 'simulated error' });

    expect(mockLogger.log).toHaveBeenCalledWith('error: simulated error');
    expect(handleError).toHaveBeenCalled();
  });

  it('calls the close handler with status code when done', () => {
    runProcess(
      'a script',
      ['arg1', 'arg2'],
      mockLogger,
      handleError,
      handleClose,
    );
    eventHandlers.close(0);

    expect(mockLogger.log).toHaveBeenCalledWith(
      'child process exited with code 0',
    );
    expect(handleClose).toHaveBeenCalledWith(0);
  });
});
