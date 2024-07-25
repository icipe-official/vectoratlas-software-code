import { MigrationInterface, QueryRunner } from "typeorm";

export class SiteSampleChange1721889075900 implements MigrationInterface {
    name = 'SiteSampleChange1721889075900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mossamp_tech_1"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "n_1"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mossamp_tech_2"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "n_2"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mossamp_tech_3"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "n_3"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mossamp_tech_4"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "n_4"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "n_all"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_3"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "good_guess"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "bad_guess"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "is_forest"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "is_rice"`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "sampling_occurrence_1" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "occurrence_n_1" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "sampling_occurrence_2" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "occurrence_n_2" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "sampling_occurrence_3" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "occurrence_n_3" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "sampling_occurrence_4" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "occurrence_n_4" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "occurrence_n_tot" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "occurrence_notes" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "occurrence_notes"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "occurrence_n_tot"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "occurrence_n_4"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "sampling_occurrence_4"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "occurrence_n_3"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "sampling_occurrence_3"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "occurrence_n_2"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "sampling_occurrence_2"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "occurrence_n_1"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "sampling_occurrence_1"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "is_rice" boolean`);
        await queryRunner.query(`ALTER TABLE "site" ADD "is_forest" boolean`);
        await queryRunner.query(`ALTER TABLE "site" ADD "bad_guess" boolean`);
        await queryRunner.query(`ALTER TABLE "site" ADD "good_guess" boolean`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_3" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "n_all" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "n_4" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mossamp_tech_4" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "n_3" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mossamp_tech_3" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "n_2" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mossamp_tech_2" character varying`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "n_1" integer`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mossamp_tech_1" character varying`);
    }

}
