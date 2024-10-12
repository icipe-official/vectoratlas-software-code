import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDatasetLogActionTypeEnum1727927560761 implements MigrationInterface {
    name = 'RemoveDatasetLogActionTypeEnum1727927560761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "last_status_update_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP COLUMN "action_type"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_log_action_type_enum"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD "action_type" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP COLUMN "action_type"`);
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_log_action_type_enum" AS ENUM('New Dataset Upload', 'Update Dataset Details', 'Dataset Re-Upload', 'Communication', 'Approve Dataset', 'Reject Raw Dataset', 'Reject Reviewed Data', 'Generate DOI')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD "action_type" "public"."uploaded_dataset_log_action_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "last_status_update_date" SET DEFAULT now()`);
    }

}
