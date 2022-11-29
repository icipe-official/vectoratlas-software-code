import { MigrationInterface, QueryRunner } from "typeorm";

export class sourceFieldLength1669367915384 implements MigrationInterface {
    name = 'sourceFieldLength1669367915384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "author" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "article_title" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "journal_title" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "citation" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "report_type" TYPE varchar`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "author" TYPE varchar(250)`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "article_title" TYPE varchar(250)`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "journal_title" TYPE varchar(250)`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "citation" TYPE varchar(500)`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "report_type" TYPE varchar(50)`);
    }

}
