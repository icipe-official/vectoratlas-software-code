import { MigrationInterface, QueryRunner } from "typeorm";

export class itnAndNotesEnvCorrections1666602427108 implements MigrationInterface {
    name = 'itnAndNotesEnvCorrections1666602427108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" RENAME COLUMN "ITN_use" TO "itn_use"`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "housing_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "housing_notes" character varying`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "community_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "community_notes" character varying`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "farming_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "farming_notes" character varying`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "livestock_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "livestock_notes" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "livestock_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "livestock_notes" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "farming_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "farming_notes" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "community_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "community_notes" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "housing_notes"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "housing_notes" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "bionomics" RENAME COLUMN "itn_use" TO "ITN_use"`);
    }

}
