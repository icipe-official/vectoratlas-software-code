
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationEntity1794345621695
  implements MigrationInterface
{
  name = 'CreateOrganizationEntity1794345621695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "organization" (
        "id" character varying(256) NOT NULL,
        "owner" character varying,
        "creation" TIMESTAMP NOT NULL DEFAULT now(),
        "updater" character varying,
        "modified" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "website" character varying,
        "logo" character varying,
        "acknowledgement" text,
        "terms_and_conditions" text,
        CONSTRAINT "UQ_organization_name" UNIQUE ("name"),
        CONSTRAINT "PK_organization_id" PRIMARY KEY ("id")
      )
    `);

    // Link shared datasets to organizations.
    await queryRunner.query(`
      ALTER TABLE "dataset"
      ADD COLUMN "organization_id" character varying(256)
    `);

    await queryRunner.query(`
      ALTER TABLE "dataset"
      ADD CONSTRAINT "FK_dataset_organization"
      FOREIGN KEY ("organization_id")
      REFERENCES "organization"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    // Preserve organization selection during the upload and review process.
    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD COLUMN "organization_id" character varying(256)
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD CONSTRAINT "FK_uploaded_dataset_organization"
      FOREIGN KEY ("organization_id")
      REFERENCES "organization"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP CONSTRAINT "FK_uploaded_dataset_organization"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN "organization_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "dataset"
      DROP CONSTRAINT "FK_dataset_organization"
    `);

    await queryRunner.query(`
      ALTER TABLE "dataset"
      DROP COLUMN "organization_id"
    `);

    await queryRunner.query(`
      DROP TABLE "organization"
    `);
  }
}
