import { MigrationInterface, QueryRunner } from 'typeorm';

export class UploadedDatasetIngestionTrackingFields1778735811063
  implements MigrationInterface
{
  name = 'UploadedDatasetIngestionTrackingFields1778735811063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "ingestion_status" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "ingestion_errors" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "total_ingested_rows" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "ingestion_progress" double precision DEFAULT '0'`,
    );
    // await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_resistance_data" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "reference" ADD CONSTRAINT "PK_01bacbbdd90839b7dce352e4250" PRIMARY KEY ("id")`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "reference" ADD CONSTRAINT "UQ_4810e019782e479affcc37578a7" UNIQUE ("num_id")`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "occurrence" ALTER COLUMN "geno_data" SET NOT NULL`,
    // );
    await queryRunner.query(
      `ALTER TABLE "bionomics" ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "occurrence" ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occurrence" DROP CONSTRAINT "FK_69457bf7344e306225f91c5bb76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bionomics" DROP CONSTRAINT "FK_c16633f8b002bd154c433959095"`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "occurrence" ALTER COLUMN "geno_data" DROP NOT NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "reference" DROP CONSTRAINT "UQ_4810e019782e479affcc37578a7"`,
    // );
    await queryRunner.query(
      `ALTER TABLE "reference" DROP CONSTRAINT "PK_01bacbbdd90839b7dce352e4250"`,
    );
    // await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_resistance_data" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "ingestion_progress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "total_ingested_rows"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "ingestion_errors"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "ingestion_status"`,
    );
  }
}
