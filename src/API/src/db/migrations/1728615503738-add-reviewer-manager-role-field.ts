import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviewerManagerRoleField1728615503738 implements MigrationInterface {
    name = 'AddReviewerManagerRoleField1728615503738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" ADD "is_reviewer_manager" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "is_reviewer_manager"`);
    }

}
