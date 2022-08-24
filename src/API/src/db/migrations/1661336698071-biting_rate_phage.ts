import { MigrationInterface, QueryRunner } from "typeorm";

export class bitingRatePhage1661336698071 implements MigrationInterface {
    name = 'bitingRatePhage1661336698071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "endo_exophagic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sampling_nights_no_indoor" integer NOT NULL, "biting_sampling_indoor" character varying(20) NOT NULL, "indoor_biting_n" integer NOT NULL, "indoor_biting_total" integer NOT NULL, "indoor_biting_data" integer NOT NULL, "sampling_nights_no_outdoor" integer NOT NULL, "biting_sampling_outdoor" character varying(20) NOT NULL, "outdoor_biting_n" integer NOT NULL, "outdoor_biting_total" integer NOT NULL, "outdoor_biting_data" integer NOT NULL, "biting_unit" character varying(20) NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_a10eb8c471145fbf6738b359edf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biting_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sampling_nights_no_indoor" integer NOT NULL, "18_30_21_30_indoor" integer NOT NULL, "21_30_00_30_indoor" integer NOT NULL, "00_30_03_30_indoor" integer NOT NULL, "03_30_06_30_indoor" integer NOT NULL, "sampling_nights_no_outdoor" integer NOT NULL, "18_30_21_30_outdoor" integer NOT NULL, "21_30_00_30_outdoor" integer NOT NULL, "00_30_03_30_outdoor" integer NOT NULL, "03_30_06_30_outdoor" integer NOT NULL, "sampling_nights_no_combined" integer NOT NULL, "18_30_21_30_combined" integer NOT NULL, "21_30_00_30_combined" integer NOT NULL, "00_30_03_30_combined" integer NOT NULL, "03_30_06_30_combined" integer NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_04ea47e075b41736e42d402a46b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "anthropo_zoophagic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "host_sampling_indoor" character varying(50) NOT NULL, "indoor_host_n" integer NOT NULL, "indoor_host_total" integer NOT NULL, "indoor_host_perc" integer NOT NULL, "host_sampling_outdoor" character varying(50) NOT NULL, "outdoor_host_n" integer NOT NULL, "outdoor_host_total" integer NOT NULL, "outdoor_host_perc" integer NOT NULL, "host_sampling_combined_1" character varying(50) NOT NULL, "host_sampling_combined_2" character varying(50) NOT NULL, "host_sampling_combined_3" character varying(50) NOT NULL, "host_sampling_combined_n" character varying(50) NOT NULL, "combined_host_n" integer NOT NULL, "combined_host_total" integer NOT NULL, "combined_host" integer NOT NULL, "host_unit" character varying(50) NOT NULL, "host_sampling_other_1" character varying(50) NOT NULL, "host_sampling_other_2" character varying(50) NOT NULL, "host_sampling_other_3" character varying(50) NOT NULL, "host_sampling_other_n" character varying(50) NOT NULL, "other_host_n" integer NOT NULL, "other_host_total" integer NOT NULL, "host_other" integer NOT NULL, "host_other_unit" character varying(50) NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_91219d23a7713d84209a2c9d2e7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "anthropo_zoophagic"`);
        await queryRunner.query(`DROP TABLE "biting_activity"`);
        await queryRunner.query(`DROP TABLE "endo_exophagic"`);
    }

}
