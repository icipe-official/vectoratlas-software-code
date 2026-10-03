import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailRegistry1787088548144 implements MigrationInterface {
  name = 'CreateEmailRegistry1787088548144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    // 1. Create the table 
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "email_registry" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "first_name" character varying NOT NULL DEFAULT '',
        "last_name" character varying NOT NULL DEFAULT '',
        "account_status" character varying NOT NULL DEFAULT 'PENDING_VERIFICATION',
        "notifications_enabled" boolean NOT NULL DEFAULT true,
        "verification_token" character varying,
        "unsubscription_token" character varying,
        "token_expires_at" TIMESTAMP,
        CONSTRAINT "UQ_email_registry_email" UNIQUE ("email"),
        CONSTRAINT "PK_email_registry_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      ALTER TABLE "email_registry" 
        DROP COLUMN IF EXISTS "verification_code",
        DROP COLUMN IF EXISTS "code_expires_at",
        DROP COLUMN IF EXISTS "is_news_notification_enabled",
        DROP COLUMN IF EXISTS "news_last_modified_at",
        DROP COLUMN IF EXISTS "is_new_dataset_notification_enabled",
        DROP COLUMN IF EXISTS "new_dataset_last_modified_at",
        DROP COLUMN IF EXISTS "is_verified";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "email_registry"`);
  }
}