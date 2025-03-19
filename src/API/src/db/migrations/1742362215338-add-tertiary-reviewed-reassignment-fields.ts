import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTertiaryReviewedReassignmentFields1742362215338 implements MigrationInterface {
    name = 'AddTertiaryReviewedReassignmentFields1742362215338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "is_tertiary_review_reassigned" boolean`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "reassigned_tertiary_reviewers" character varying array DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "reassigned_tertiary_reviewers"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "is_tertiary_review_reassigned"`);
    }

}
