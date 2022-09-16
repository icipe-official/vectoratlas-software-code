import { MigrationInterface, QueryRunner } from "typeorm";

export class citation1663314863613 implements MigrationInterface {
    name = 'citation1663314863613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT "UQ_6da2fc126c3f67ce0fdcecbc5f8"`);
        await queryRunner.query(`ALTER TABLE "reference" ADD "citation" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "UQ_30733720a40f8d4bb3b83d06735" UNIQUE ("citation", "year")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT "UQ_30733720a40f8d4bb3b83d06735"`);
        await queryRunner.query(`ALTER TABLE "reference" DROP COLUMN "citation"`);
        await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "UQ_6da2fc126c3f67ce0fdcecbc5f8" UNIQUE ("author", "article_title", "journal_title", "year")`);
    }

}
