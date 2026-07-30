import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToRecordedSpecies1783516161726 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP TRIGGER IF EXISTS t_populate_recorded_species ON "recorded_species"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS populate_recorded_species()`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "display_name" varchar`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "category" varchar`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "color" varchar`);

        
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS t_populate_recorded_species ON "recorded_species"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS populate_recorded_species`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "color"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "category"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "display_name"`);
    }
}