import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorFieldToDoi1741618647304 implements MigrationInterface {
    name = 'AddAuthorFieldToDoi1741618647304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" ADD "author" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "author"`);
    }

}
