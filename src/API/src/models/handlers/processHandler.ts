import { spawn } from 'child_process';

export const runProcess = (
  script,
  scriptArguments,
  logger,
  handleError,
  handleClose,
) => {
  const transformProcess = spawn(script, scriptArguments);
  logger.log('Process id: ' + transformProcess.pid);

  transformProcess.stdout.on('data', (data) => {
    logger.log(`stdout: ${data}`);
  });

  transformProcess.stderr.on('data', (data) => {
    handleError();
    logger.log(`stderr: ${data}`);
  });

  transformProcess.on('error', (error) => {
    handleError();
    logger.log(`error: ${error.message}`);
  });

  transformProcess.on('close', (code) => {
    logger.log(`child process exited with code ${code}`);
    handleClose(code);
  });
};
