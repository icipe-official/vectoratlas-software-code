import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFilters1779705286329 implements MigrationInterface {
    name = 'FixFilters1779705286329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add the new columns to the occurrence table
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "season_given" character varying`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "season_calc" character varying`);

        // 2. Update existing NULL values in bionomics to the string 'false'
        await queryRunner.query(`
            UPDATE "bionomics" 
            SET "insecticide_resistance_data" = 'false' 
            WHERE "insecticide_resistance_data" IS NULL
        `);

        // 3. Apply the NOT NULL constraint now that there are no NULLs
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_resistance_data" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Revert the NOT NULL constraint
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_resistance_data" DROP NOT NULL`);

        // 2. Drop the newly added columns from the occurrence table
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "season_calc"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "season_given"`);
    }
}