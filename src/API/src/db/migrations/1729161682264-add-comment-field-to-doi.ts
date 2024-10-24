import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentFieldToDoi1729161682264 implements MigrationInterface {
    name = 'AddCommentFieldToDoi1729161682264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" ADD "comments" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "comments"`);
    }

}
