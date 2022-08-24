import { MigrationInterface, QueryRunner } from "typeorm";

export class endoExophily1661338246036 implements MigrationInterface {
    name = 'endoExophily1661338246036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "endo_exophily" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resting_sampling_indoor" character varying(20) NOT NULL, "unfed_indoor" integer NOT NULL, "fed_indoor" integer NOT NULL, "gravid_indoor" integer NOT NULL, "total_indoor" integer NOT NULL, "resting_sampling_outdoor" character varying(20) NOT NULL, "unfed_outdoor" integer NOT NULL, "fed_outdoor" integer NOT NULL, "gravid_outdoor" integer NOT NULL, "total_outdoor" integer NOT NULL, "resting_sampling_other" character varying(20) NOT NULL, "unfed_other" integer NOT NULL, "fed_other" integer NOT NULL, "gravid_other" integer NOT NULL, "total_other" integer NOT NULL, "resting_unit" character varying(50) NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_4abfe8867c98bde6fa0d7457c0a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "endo_exophily"`);
    }

}
