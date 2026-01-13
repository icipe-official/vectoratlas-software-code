import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCitationToSpeciesInfo1750070757621 implements MigrationInterface {
  name = 'AddCitationToSpeciesInfo1750070757621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "species_information" ADD "citations" text`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."doi_source_source_type_enum" RENAME TO "doi_source_source_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."doi_source_source_type_enum" AS ENUM('Download', 'Upload', 'Model Upload')`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi_source" ALTER COLUMN "source_type" TYPE "public"."doi_source_source_type_enum" USING "source_type"::"text"::"public"."doi_source_source_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."doi_source_source_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."doi_source_source_type_enum_old" AS ENUM('Download', 'Upload')`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi_source" ALTER COLUMN "source_type" TYPE "public"."doi_source_source_type_enum_old" USING "source_type"::"text"::"public"."doi_source_source_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."doi_source_source_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."doi_source_source_type_enum_old" RENAME TO "doi_source_source_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "species_information" DROP COLUMN "citations"`,
    );
  }
}
