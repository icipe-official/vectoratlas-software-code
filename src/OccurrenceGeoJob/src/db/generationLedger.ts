/**
 * Generation ledger for the API's full-occurrence-data staleness checks.
 *
 * After the payload files are generated, this writes a `generation-ledger.json`
 * into the target directory. The API (full-occurrence-data.service.ts) reads it
 * to decide whether the served files are stale: a newer Approved dataset, a
 * changed approved-id set (approve/disapprove/delete), or species/country edits
 * all trigger regeneration.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pool, logger } from '@/utils/index.js';

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

export const GENERATION_LEDGER_FILE = 'generation-ledger.json';

/**
 * Compute the ledger from the database and write it into targetDirectory.
 */
export async function writeGenerationLedger(
  targetDirectory: string,
  files: string[],
): Promise<GenerationLedger> {
  const dsRows = await pool.query(
    `SELECT id, "ApprovedAt", "UpdatedAt" FROM dataset WHERE status='Approved' ORDER BY id`,
  );
  let latest: { id: string; approvedAt: Date } | null = null;
  for (const r of dsRows.rows) {
    const arr: any[] = r.ApprovedAt || [];
    const fromArr = arr.length
      ? new Date(Math.max(...arr.map((d: any) => new Date(d).getTime())))
      : null;
    // fall back to UpdatedAt when ApprovedAt was never recorded (manual approvals)
    const mx = fromArr ?? (r.UpdatedAt ? new Date(r.UpdatedAt) : null);
    if (mx && (!latest || mx > new Date(latest.approvedAt))) {
      latest = { id: r.id, approvedAt: mx };
    }
  }
  const approvedIdsHash = crypto
    .createHash('sha256')
    .update(dsRows.rows.map((r) => r.id).sort().join(','))
    .digest('hex');
  const speciesMod = await pool.query(
    `SELECT coalesce(max(modified), '1970-01-01T00:00:00Z') AS m FROM species`,
  );
  const countryMod = await pool.query(
    `SELECT coalesce(max(modified), '1970-01-01T00:00:00Z') AS m FROM country`,
  );

  const ledger: GenerationLedger = {
    approvedDatasetId: latest?.id ?? null,
    approvedAt: latest ? new Date(latest.approvedAt).toISOString() : null,
    approvedIdsHash,
    speciesModified: new Date(speciesMod.rows[0].m).toISOString(),
    countryModified: new Date(countryMod.rows[0].m).toISOString(),
    generatedAt: new Date().toISOString(),
    files,
  };
  await fs.writeFile(
    path.join(targetDirectory, GENERATION_LEDGER_FILE),
    JSON.stringify(ledger, null, 2),
  );
  logger.info(`Wrote generation ledger to ${targetDirectory}/${GENERATION_LEDGER_FILE}`);
  return ledger;
}
