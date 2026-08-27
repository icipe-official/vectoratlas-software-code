import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmailRegistry1787088548144 implements MigrationInterface {
    name = 'CreateEmailRegistry1787088548144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop old columns from email_registry
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "verification_code"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "code_expires_at"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "is_news_notification_enabled"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "news_last_modified_at"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "is_new_dataset_notification_enabled"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "new_dataset_last_modified_at"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "is_verified"`);

        // Add new columns to email_registry
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "account_status" character varying NOT NULL DEFAULT 'pending_verification'`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "notifications_enabled" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "verification_token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "token_expires_at" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback new columns
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "verification_token"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "notifications_enabled"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "account_status"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "first_name"`);

        // Restore old columns
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "new_dataset_last_modified_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "is_new_dataset_notification_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "news_last_modified_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "is_news_notification_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "code_expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "verification_code" text`);
    }
}
