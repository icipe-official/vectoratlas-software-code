import { MigrationInterface, QueryRunner } from "typeorm";

export class sourceChanges1669289031704 implements MigrationInterface {
    name = 'sourceChanges1669289031704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP CONSTRAINT "FK_d4322ba81dd514a55d9b66852ff"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" RENAME COLUMN "speciesId" TO "species"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "species"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species" character varying`);
        await queryRunner.query(`DROP TABLE "species"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "species"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recorded_species" RENAME COLUMN "species" TO "speciesId"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD CONSTRAINT "FK_d4322ba81dd514a55d9b66852ff" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
