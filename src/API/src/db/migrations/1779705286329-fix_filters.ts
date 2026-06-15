import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFilters1779705286329 implements MigrationInterface {
    name = 'FixFilters1779705286329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "season_given" character varying`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "season_calc" character varying`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_resistance_data" SET NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "geno_data" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "geno_data" DROP NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_resistance_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "season_calc"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "season_given"`);
    }

}
