import { Pool } from 'pg';
import logger from './logger.js';

const pool = new Pool();

pool.on('error', (err) => {
  logger.error('unexpected pool error %O', err);
});

async function gracefullShutdown(exitCode: number = 0) {
  await pool.end();
  process.exit(exitCode);
}

process.on('SIGINT', async () => {
  await gracefullShutdown();
});

process.on('SIGTERM', async () => {
  await gracefullShutdown();
});

process.on('uncaughtException', async (err) => {
  logger.error('Uncaught Exception: %O', err);
  await pool.end(); // Clean up before crashing
  process.exit(1);
});

process.on('unhandledRejection', async (err) => {
  logger.error('Unhandled Rejection: %O', err);
  await gracefullShutdown(1);
});

export default pool;
