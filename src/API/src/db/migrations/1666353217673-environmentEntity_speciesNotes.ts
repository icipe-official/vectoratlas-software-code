import { MigrationInterface, QueryRunner } from "typeorm";

export class environmentEntitySpeciesNotes1666353217673 implements MigrationInterface {
    name = 'environmentEntitySpeciesNotes1666353217673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "environment" ("id" character varying(256) NOT NULL, "roof" character varying(50), "walls" character varying(50), "house_screening" boolean, "open_eaves" boolean, "cooking" character varying(50), "housing_notes" character varying(50), "occupation" character varying(50), "outdoor_activities_night" boolean, "sleeping_outdoors" boolean, "community_notes" character varying(50), "farming" character varying(50), "farming_notes" character varying(50), "livestock" character varying(50), "livestock_notes" character varying(50), "local_plants" character varying(50), CONSTRAINT "PK_f0ec97d0ac5e0e2f50f7475699f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species_notes" character varying`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "study_sampling_design" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "ITN_use" boolean`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "environmentId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_b7b6e0077e7331785abad7f2b1e" UNIQUE ("environmentId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_b7b6e0077e7331785abad7f2b1e" FOREIGN KEY ("environmentId") REFERENCES "environment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_b7b6e0077e7331785abad7f2b1e"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_b7b6e0077e7331785abad7f2b1e"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "environmentId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "ITN_use"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "study_sampling_design"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "species_notes"`);
        await queryRunner.query(`DROP TABLE "environment"`);
    }
}