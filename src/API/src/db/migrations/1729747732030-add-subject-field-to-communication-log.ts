import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubjectFieldToCommunicationLog1729747732030 implements MigrationInterface {
    name = 'AddSubjectFieldToCommunicationLog1729747732030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication_log" ADD "subject" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."uploaded_dataset_status_enum" RENAME TO "uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum" AS ENUM('Pending', 'Primary Review', 'Pending Tertiary Review', 'Tertiary Review', 'Rejected', 'Rejected By Reviewer Manager', 'Pending Approval', 'Approved')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "status" TYPE "public"."uploaded_dataset_status_enum" USING "status"::"text"::"public"."uploaded_dataset_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum_old" AS ENUM('Pending', 'Approved', 'Primary Review', 'Tertiary Review', 'Rejected', 'Rejected By Reviewer Manager')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "status" TYPE "public"."uploaded_dataset_status_enum_old" USING "status"::"text"::"public"."uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."uploaded_dataset_status_enum_old" RENAME TO "uploaded_dataset_status_enum"`);
        await queryRunner.query(`ALTER TABLE "communication_log" DROP COLUMN "subject"`);
    }

}
