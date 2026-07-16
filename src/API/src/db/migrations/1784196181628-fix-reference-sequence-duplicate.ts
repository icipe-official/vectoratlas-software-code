import { MigrationInterface, QueryRunner } from "typeorm";

export class FixReferenceSequenceDuplicate1784196181628 implements MigrationInterface {
  name = 'FixReferenceSequenceDuplicate1784196181628'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "reference_id_seq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reference_id_seq" INCREMENT 1 START 1 MINVALUE 1 OWNED BY "reference"."num_id"`);
  }
}
