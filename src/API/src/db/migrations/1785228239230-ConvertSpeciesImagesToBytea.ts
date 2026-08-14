import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertSpeciesImagesToBytea1785228239230 implements MigrationInterface {
    name = 'ConvertSpeciesImagesToBytea1785228239230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species_information" DROP COLUMN IF EXISTS "speciesImage"`);
        await queryRunner.query(`ALTER TABLE "species_information" ADD "speciesImage" bytea`);
        await queryRunner.query(`ALTER TABLE "species_information" DROP COLUMN IF EXISTS "previewImage"`);
        await queryRunner.query(`ALTER TABLE "species_information" ADD "previewImage" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species_information" DROP COLUMN IF EXISTS "previewImage"`);
        await queryRunner.query(`ALTER TABLE "species_information" ADD "previewImage" character varying`);
        await queryRunner.query(`ALTER TABLE "species_information" DROP COLUMN IF EXISTS "speciesImage"`);
        await queryRunner.query(`ALTER TABLE "species_information" ADD "speciesImage" character varying`);
    }

}