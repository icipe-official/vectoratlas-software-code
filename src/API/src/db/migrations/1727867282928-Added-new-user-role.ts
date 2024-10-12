import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNewUserRole1727867282928 implements MigrationInterface {
    name = 'AddedNewUserRole1727867282928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" ADD "is_reviewerManager" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "is_reviewerManager"`);
    }

}
