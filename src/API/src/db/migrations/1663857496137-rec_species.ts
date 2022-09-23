import { MigrationInterface, QueryRunner } from "typeorm";

export class recSpecies1663857496137 implements MigrationInterface {
    name = 'recSpecies1663857496137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_4823840f77c01c8be609169e940"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "speciesId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "speciesId" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_4823840f77c01c8be609169e940" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
