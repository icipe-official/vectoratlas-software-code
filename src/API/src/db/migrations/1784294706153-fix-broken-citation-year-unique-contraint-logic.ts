import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBrokenCitationYearUniqueContraintLogic1784294706153 implements MigrationInterface {
  name = 'FixBrokenCitationYearUniqueContraintLogic1784294706153'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old broken unique constraint on (citation, year) - this enforced uniqueness even with empty citation
    await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT IF EXISTS "UQ_30733720a40f8d4bb3b83d06735"`);

    // Create a new partial unique index on (citation, year) that only enforces uniqueness
    // when BOTH citation is non-empty AND year is NOT NULL
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_reference_citation_year_unique_both_set" ON "reference" (citation, "year") WHERE citation <> '' AND "year" IS NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new partial unique index
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reference_citation_year_unique_both_set"`);

    // Restore the old constraint on (citation, year) which was too strict (enforced even with empty citation)
    await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "UQ_30733720a40f8d4bb3b83d06735" UNIQUE (citation, year)`);
  }
}
