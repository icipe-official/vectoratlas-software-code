import { MigrationInterface, QueryRunner } from "typeorm";

export class speciesInformation1669308156740 implements MigrationInterface {
    name = 'speciesInformation1669308156740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "species_information" ("id" character varying(256) NOT NULL, "name" character varying(256) NOT NULL, "shortDescription" character varying(1024) NOT NULL, "description" character varying NOT NULL, "speciesImage" character varying NOT NULL, "distributionMapUrl" character varying(256) NOT NULL, CONSTRAINT "PK_93ae695e01b3f61d330735a4c6a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "species_information"`);
    }

}
