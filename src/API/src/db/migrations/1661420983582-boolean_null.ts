import { MigrationInterface, QueryRunner } from "typeorm";

export class booleanNull1661420983582 implements MigrationInterface {
    name = 'booleanNull1661420983582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "control" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "location" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "good_guess" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "bad_guess" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "is_forest" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "is_rice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "species_1" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "assi" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "published" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "v_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "adult_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "larval_site_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "contact_authors" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_control" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "insecticide_control" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "contact_authors" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "larval_site_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "adult_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "v_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "published" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "assi" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "species" ALTER COLUMN "species_1" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "is_rice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "is_forest" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "bad_guess" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "good_guess" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "location" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sample" ALTER COLUMN "control" SET NOT NULL`);
    }

}
