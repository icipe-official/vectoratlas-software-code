import { MigrationInterface, QueryRunner } from "typeorm";

export class bionomicsBase1661179834889 implements MigrationInterface {
    name = 'bionomicsBase1661179834889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bionomics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adult_data" boolean NOT NULL, "larval_site_data" boolean NOT NULL, "contact_authors" boolean NOT NULL, "contact_notes" character varying(50) NOT NULL, "secondary_info" character varying(50) NOT NULL, "insecticide_control" boolean NOT NULL, "control" character varying(250) NOT NULL, "control_notes" character varying(10485760) NOT NULL, "month_start" integer NOT NULL, "year_start" integer NOT NULL, "month_end" integer NOT NULL, "year_end" integer NOT NULL, "season_given" character varying(50) NOT NULL, "season_calc" character varying(50) NOT NULL, "season_notes" character varying(10485760) NOT NULL, "id_1" character varying(250) NOT NULL, "id_2" character varying(250) NOT NULL, "data_abstracted_by" character varying(250) NOT NULL, "data_checked_by" character varying(250) NOT NULL, CONSTRAINT "PK_97c382a3550af8e528406eb732b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bionomics"`);
    }

}
