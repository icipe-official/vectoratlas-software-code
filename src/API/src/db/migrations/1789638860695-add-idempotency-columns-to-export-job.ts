import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdempotencyColumnsToExportJob1789638860695
  implements MigrationInterface
{
  name = 'AddIdempotencyColumnsToExportJob1789638860695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // clientRequestId: unique per download attempt, reused across retries.
    // Used for idempotency — prevents zombie jobs when a POST succeeds
    // on the server but the response is lost (e.g. envoy 504 timeout).
    await queryRunner.query(
      `ALTER TABLE "exportJob" ADD "clientRequestId" varchar`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_exportJob_clientRequestId" ON "exportJob" ("clientRequestId")`,
    );

    // contentHash: SHA-256 of sorted occurrence IDs.
    // Used for cross-user reuse — if two users export the exact same
    // row set, the second user gets the existing completed job's download.
    // Null for "download all" requests (no reuse, data may have changed).
    await queryRunner.query(
      `ALTER TABLE "exportJob" ADD "contentHash" varchar`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_exportJob_contentHash" ON "exportJob" ("contentHash")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_exportJob_contentHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exportJob" DROP COLUMN "contentHash"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_exportJob_clientRequestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exportJob" DROP COLUMN "clientRequestId"`,
    );
  }
}
