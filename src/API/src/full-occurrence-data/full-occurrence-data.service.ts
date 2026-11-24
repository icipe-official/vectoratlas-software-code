import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { spawn } from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Redis } from 'ioredis';
import config from 'src/config/config';

const LEDGER_FILE = 'generation-ledger.json';
const REQUIRED_FILES = [
  'data.json',
  'data.geojson',
  'presence.geojson',
  'absence.geojson',
];
// Redis key for the cross-replica generation lock (the API runs HA — e.g. 2
// replicas — all sharing FULL_OCCURRENCE_DATA_FOLDER on a PVC)
const LOCK_KEY = 'full-occurrence-data:generation-lock';
const LOCK_TTL_MS = 30 * 60 * 1000;

export interface GenerationLedger {
  approvedDatasetId: string | null;
  approvedAt: string | null;
  /** sha256 of sorted approved dataset ids — detects disapprove/delete */
  approvedIdsHash: string;
  speciesModified: string;
  countryModified: string;
  generatedAt: string;
  files: string[];
}

export interface EnsureResult {
  /** true when a refresh is running in the background and stale data was served */
  refreshing: boolean;
}

@Injectable()
export class FullOccurrenceDataService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(FullOccurrenceDataService.name);
  private inflight: Promise<void> | null = null;
  private redis: Redis;

  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    const password = process.env.REDIS_PASSWORD;
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ...(password ? { password } : {}),
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
    });
    this.redis.on('error', (e) =>
      this.logger.warn(`redis (generation lock) error: ${e.message}`),
    );
  }

  /** run a redis command but never hang the request if redis is down */
  private async redisOp<T>(op: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await Promise.race([
        op(),
        new Promise<T>((r) => setTimeout(() => r(fallback), 3000)),
      ]);
    } catch {
      return fallback;
    }
  }

  onModuleDestroy() {
    void this.redis?.quit();
  }

  /**
   * Try to acquire the cross-replica generation lock. With wait=true, poll
   * until the lock is free (or timeoutMs elapses) — used on cold starts where
   * the caller blocks until the files exist.
   */
  private async acquireLock(
    wait: boolean,
    timeoutMs = LOCK_TTL_MS,
  ): Promise<string | null> {
    const token = crypto.randomUUID();
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const ok = await this.redisOp(
        () => this.redis.set(LOCK_KEY, token, 'PX', LOCK_TTL_MS, 'NX'),
        null,
      );
      if (ok === 'OK') return token;
      if (!wait || Date.now() > deadline) return null;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  private async releaseLock(token: string): Promise<void> {
    // only delete the lock if we still own it
    await this.redisOp(
      () =>
        this.redis.eval(
          "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
          1,
          LOCK_KEY,
          token,
        ),
      0,
    );
  }

  private async lockHeldByOther(): Promise<boolean> {
    return (await this.redisOp(() => this.redis.exists(LOCK_KEY), 0)) === 1;
  }

  getFolder(): string {
    return config.get('fullOccurrenceDataFolder');
  }

  private ledgerPath(): string {
    return path.join(this.getFolder(), LEDGER_FILE);
  }

  readLedger(): GenerationLedger | null {
    try {
      return JSON.parse(fs.readFileSync(this.ledgerPath(), 'utf8'));
    } catch {
      return null;
    }
  }

  /** sorted hash of approved dataset ids — catches disapprove/delete even when timestamps don't move */
  private async approvedIdsHash(): Promise<string> {
    const rows: any[] = await this.dataSource.query(
      "SELECT id FROM dataset WHERE status='Approved' ORDER BY id",
    );
    const ids = rows.map((r) => r.id).sort();
    return crypto.createHash('sha256').update(ids.join(',')).digest('hex');
  }

  private async latestApprovedAt(): Promise<number | null> {
    const rows: any[] = await this.dataSource.query(
      'SELECT "ApprovedAt", "UpdatedAt" FROM dataset WHERE status=\'Approved\'',
    );
    let latest: number | null = null;
    for (const r of rows) {
      const cands = [
        ...(r.ApprovedAt || []).map((d: any) => new Date(d).getTime()),
      ];
      if (r.UpdatedAt) cands.push(new Date(r.UpdatedAt).getTime());
      for (const t of cands) if (latest === null || t > latest) latest = t;
    }
    return latest;
  }

  private async maxModified(table: string): Promise<number> {
    const r: any = await this.dataSource.query(
      `SELECT coalesce(max(modified),'1970-01-01T00:00:00Z') AS m FROM ${table}`,
    );
    return new Date(r[0].m).getTime();
  }

  private hasPreviousVersion(): boolean {
    // a ledger means one full generation completed; individual missing files
    // are served as 404 while the background refresh recreates them
    return this.readLedger() !== null;
  }

  /**
   * Stale when any output file is missing, no ledger, a newer Approved dataset
   * exists, the approved-id set changed (approve/disapprove/delete), or
   * species/country rows were modified after the ledger was written.
   */
  async isStale(): Promise<boolean> {
    const folder = this.getFolder();
    for (const f of REQUIRED_FILES) {
      if (!fs.existsSync(path.join(folder, f))) return true;
    }
    const ledger = this.readLedger();
    if (!ledger) return true;

    const [idsHash, latestApproved, spMod, coMod] = await Promise.all([
      this.approvedIdsHash(),
      this.latestApprovedAt(),
      this.maxModified('species'),
      this.maxModified('country'),
    ]);

    if (ledger.approvedIdsHash && ledger.approvedIdsHash !== idsHash)
      return true;
    if (
      latestApproved !== null &&
      (!ledger.approvedAt ||
        new Date(ledger.approvedAt).getTime() < latestApproved)
    ) {
      return true;
    }
    if (spMod > new Date(ledger.speciesModified).getTime()) return true;
    if (coMod > new Date(ledger.countryModified).getTime()) return true;

    return false;
  }

  /** true while a generation run is in flight (this process or another replica) */
  private async jobInFlight(): Promise<boolean> {
    if (this.inflight) return true;
    try {
      return await this.lockHeldByOther();
    } catch {
      return false; // redis down — fall back to the local view only
    }
  }

  /**
   * Run the OccurrenceGeoJob CLI once and await it. Singleton across ALL API
   * replicas via a Redis lock (they share FULL_OCCURRENCE_DATA_FOLDER on a
   * PVC), plus an in-process lock. The job runs in its own child process, so
   * the API event loop stays responsive while it generates and compresses.
   */
  private kickOff(): Promise<void> {
    if (this.inflight) return this.inflight;
    this.inflight = (async () => {
      const token = await this.acquireLock(false); // background refresh: don't wait
      if (!token) {
        this.logger.log(
          'generation already running on another replica, skipping',
        );
        return;
      }
      try {
        await this.runJob();
      } finally {
        await this.releaseLock(token);
      }
    })()
      .catch((e) => {
        this.logger.error(`generation failed: ${e?.message || e}`);
      })
      .finally(() => {
        this.inflight = null;
      });
    return this.inflight;
  }

  /** Cold-start variant: block until the lock is free, then generate if still stale. */
  private kickOffBlocking(): Promise<void> {
    if (this.inflight) return this.inflight;
    this.inflight = (async () => {
      const token = await this.acquireLock(true); // wait for another replica if needed
      if (!token) {
        this.logger.error('timed out waiting for the generation lock');
        return;
      }
      try {
        if (await this.isStale()) {
          await this.runJob();
        } else {
          this.logger.log('another replica already regenerated, skipping');
        }
      } finally {
        await this.releaseLock(token);
      }
    })()
      .catch((e) => {
        this.logger.error(`generation failed: ${e?.message || e}`);
      })
      .finally(() => {
        this.inflight = null;
      });
    return this.inflight;
  }

  private async runJob(): Promise<void> {
    const jobDir = config.get('occurrenceGeoJobDir');
    const env = {
      ...process.env,
      // the job's pg Pool reads the standard PG* variables
      PGHOST: process.env.POSTGRES_HOST,
      PGPORT: process.env.PGPORT,
      PGUSER: process.env.POSTGRES_USER,
      PGPASSWORD: process.env.POSTGRES_PASSWORD,
      PGDATABASE: process.env.POSTGRES_DB,
      // job-specific settings use the OCC_GEO_JOB_ prefix
      OCC_GEO_JOB_SQL_QUERIES_FOLDER: path.join(jobDir, 'sql'),
      OCC_GEO_JOB_TARGET_DIRECTORY: this.getFolder(),
      OCC_GEO_JOB_STAGING_DIRECTORY: path.join(jobDir, '.tmp/staging'),
      OCC_GEO_JOB_CREATE_BACKUP: 'false',
    };
    this.logger.log(`spawning OccurrenceGeoJob CLI in ${jobDir}`);
    await new Promise<void>((resolve, reject) => {
      const child = spawn('node', ['dist/index.js'], { cwd: jobDir, env });
      child.stdout.on('data', (d) =>
        String(d)
          .trim()
          .split('\n')
          .forEach((l) => l && this.logger.log(`[geojob] ${l}`)),
      );
      child.stderr.on('data', (d) =>
        String(d)
          .trim()
          .split('\n')
          .forEach((l) => l && this.logger.error(`[geojob] ${l}`)),
      );
      child.on('error', reject);
      child.on('close', (code) =>
        code === 0
          ? resolve()
          : reject(new Error(`OccurrenceGeoJob exited with code ${code}`)),
      );
    });
    this.logger.log('OccurrenceGeoJob CLI finished');
  }

  /**
   * Ensure the files exist and are fresh.
   * - not stale -> nothing to do
   * - stale + previous valid version exists -> kick off refresh in background and
   *   report refreshing=true (caller serves the stale files with a hint header)
   * - stale + no previous version -> block until generation completes (cold start)
   */
  async ensureGenerated(): Promise<EnsureResult> {
    const stale = await this.isStale();
    this.logger.log(
      `ensureGenerated: stale=${stale} folder=${this.getFolder()}`,
    );
    if (!stale) return { refreshing: false };

    if (this.hasPreviousVersion()) {
      void this.kickOff(); // fire and forget; serve stale now
      return { refreshing: true };
    }
    await this.kickOffBlocking(); // cold: wait for the first generation
    return { refreshing: false };
  }

  /** lightweight status for the UI (no side effects) */
  async status() {
    const [stale, inFlight] = await Promise.all([
      this.isStale(),
      this.jobInFlight(),
    ]);
    return {
      stale,
      refreshing: inFlight,
      hasPrevious: this.hasPreviousVersion(),
    };
  }
}
