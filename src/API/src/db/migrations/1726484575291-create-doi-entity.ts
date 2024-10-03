import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDoiEntity1726484575291 implements MigrationInterface {
    name = 'CreateDoiEntity1726484575291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doi" ("id" SERIAL NOT NULL, "creation" TIMESTAMP WITH TIME ZONE, "modified" TIMESTAMP WITH TIME ZONE, "owner" character varying, "updater" character varying, "creator_name" character varying NOT NULL, "creator_email" character varying NOT NULL, "description" character varying NOT NULL, "title" character varying NOT NULL, "publication_year" integer NOT NULL, "source_type" character varying NOT NULL, "meta_data" json NOT NULL, "resolving_url" character varying, "doi_response" json, "resolver_id" character varying, "doi_id" character varying, "is_draft" boolean, CONSTRAINT "PK_56a00f721a8979e01b4bc0e2068" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "doi"`);
    }

}
