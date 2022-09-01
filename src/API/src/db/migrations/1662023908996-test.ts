import { MigrationInterface, QueryRunner } from "typeorm";

export class test1662023908996 implements MigrationInterface {
    name = 'test1662023908996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_c16633f8b002bd154c433959095"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_4440983ad72e1de4e830e586d77"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad"`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "referenceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "siteId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "speciesId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "UQ_6da2fc126c3f67ce0fdcecbc5f8" UNIQUE ("author", "article_title", "journal_title", "year")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_4440983ad72e1de4e830e586d77" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_4440983ad72e1de4e830e586d77"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_c16633f8b002bd154c433959095"`);
        await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT "UQ_6da2fc126c3f67ce0fdcecbc5f8"`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "speciesId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "siteId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "referenceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_4440983ad72e1de4e830e586d77" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
