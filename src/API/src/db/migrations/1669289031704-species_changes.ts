import { MigrationInterface, QueryRunner } from "typeorm";

export class speciesChanges1669289031704 implements MigrationInterface {
    name = 'speciesChanges1669289031704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP CONSTRAINT "FK_d4322ba81dd514a55d9b66852ff"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species" character varying`);
        await queryRunner.query(`UPDATE "recorded_species" SET species=species.species FROM species WHERE species.id = "speciesId"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "speciesId"`);
        await queryRunner.query(`DROP TABLE "species"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "species"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recorded_species" RENAME COLUMN "species" TO "speciesId"`);
        await queryRunner.query(`CREATE TABLE "species" ("id" character varying(256) NOT NULL, "subgenus" character varying(50) NOT NULL, "series" character varying(50), "section" character varying(50), "complex" character varying(50), "species" character varying(50) NOT NULL, "species_author" character varying(250) NOT NULL, "year" character varying, "referenceId" character varying(256) NOT NULL, CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD CONSTRAINT "FK_d4322ba81dd514a55d9b66852ff" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
