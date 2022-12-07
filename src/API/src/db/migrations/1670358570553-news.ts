import { MigrationInterface, QueryRunner } from "typeorm";

export class news1670358570553 implements MigrationInterface {
    name = 'news1670358570553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news" ("id" character varying(256) NOT NULL, "title" character varying(256) NOT NULL, "summary" character varying(1024) NOT NULL, "article" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "news"`);
    }

}
