import { MigrationInterface, QueryRunner } from "typeorm";

export class EnableNullOnColumns1790928435408 implements MigrationInterface {
  name = 'EnableNullOnColumns1790928435408'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Sample table - occurrence count columns
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_1" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_2" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_3" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_4" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_total" DROP NOT NULL`);

    // Occurrence table - temporal columns
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "month_start" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "year_start" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "month_end" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "year_end" DROP NOT NULL`);

    // Bionomics table - temporal columns (same as occurrence)
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "month_start" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "year_start" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "month_end" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "year_end" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Sample table - occurrence count columns
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_1" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_2" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_3" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_4" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "occurrence_n_total" SET NOT NULL`);

    // Occurrence table - temporal columns
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "month_start" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "year_start" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "month_end" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "year_end" SET NOT NULL`);

    // Bionomics table - temporal columns
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "month_start" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "year_start" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "month_end" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "year_end" SET NOT NULL`);
  }

}
