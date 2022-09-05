import { MigrationInterface, QueryRunner } from "typeorm";

export class totalIntFloat1662366020129 implements MigrationInterface {
    name = 'totalIntFloat1662366020129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" DROP COLUMN "indoor_host_total"`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" ADD "indoor_host_total" double precision`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" DROP COLUMN "outdoor_host_total"`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" ADD "outdoor_host_total" double precision`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" DROP COLUMN "combined_host_total"`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" ADD "combined_host_total" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" DROP COLUMN "combined_host_total"`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" ADD "combined_host_total" integer`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" DROP COLUMN "outdoor_host_total"`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" ADD "outdoor_host_total" integer`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" DROP COLUMN "indoor_host_total"`);
        await queryRunner.query(`ALTER TABLE "anthropo_zoophagic" ADD "indoor_host_total" integer`);
    }

}
