import { MigrationInterface, QueryRunner } from 'typeorm';

export class MadeNumidAutoIncrementUnique1750769839255 implements MigrationInterface {
  name = 'MadeNumidAutoIncrementUnique1750769839255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Ensure all num_id values are unique
    await queryRunner.query(`
      WITH numbered AS (
        SELECT id, ROW_NUMBER() OVER () AS rn
        FROM reference
      )
      UPDATE reference
      SET num_id = numbered.rn
      FROM numbered
      WHERE reference.id = numbered.id
    `);

    // Step 2: Set num_id to NOT NULL (required before identity)
    await queryRunner.query(`
      ALTER TABLE "reference"
      ALTER COLUMN "num_id" SET NOT NULL
    `);

    // Step 3: Make num_id an identity (auto-increment)
    await queryRunner.query(`
      ALTER TABLE "reference"
      ALTER COLUMN "num_id" ADD GENERATED ALWAYS AS IDENTITY
    `);

    // Step 4: Add a unique index
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_4810e019782e479affcc37578a7"
      ON "reference" ("num_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop unique index
    await queryRunner.query(`
      DROP INDEX "UQ_4810e019782e479affcc37578a7"
    `);

    // Step 2: Remove identity property
    await queryRunner.query(`
      ALTER TABLE "reference"
      ALTER COLUMN "num_id" DROP IDENTITY IF EXISTS
    `);

    // Step 3: Allow NULLs again (if you want to revert fully)
    await queryRunner.query(`
      ALTER TABLE "reference"
      ALTER COLUMN "num_id" DROP NOT NULL
    `);
  }
}
