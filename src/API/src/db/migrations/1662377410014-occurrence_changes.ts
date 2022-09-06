import { MigrationInterface, QueryRunner } from "typeorm";

export class occurrenceChanges1662377410014 implements MigrationInterface {
    name = 'occurrenceChanges1662377410014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mos_id_1"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mos_id_2"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mos_id_3"`);
        await queryRunner.query(`ALTER TABLE "sample" DROP COLUMN "mos_id_4"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "area_type"`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_method_3" character varying(250)`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "area_type" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "area_type"`);
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_method_3"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "area_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mos_id_4" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mos_id_3" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mos_id_2" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "sample" ADD "mos_id_1" character varying(20)`);
    }

}
