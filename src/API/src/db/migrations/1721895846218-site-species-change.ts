import { MigrationInterface, QueryRunner } from "typeorm";

export class SiteSpeciesChange1721895846218 implements MigrationInterface {
    name = 'SiteSpeciesChange1721895846218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "ss_sl"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "assi"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "assi_notes"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "id_method_1"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "id_method_2"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "id_method_3"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "map_site"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "gaul_code"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_level"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_1"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_2"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_2_id"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latlong_source"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "rural_urban"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "georef_notes"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species_id_1" character varying`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "species_id_2" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "site" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_3" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_3" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_4" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_4" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_5" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_5" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_6" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_6" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_7" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_7" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_8" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_8" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "confidence_in_georef" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_level_1" integer`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_level_2" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_level_2"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_level_1"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "confidence_in_georef"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_8"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_8"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_7"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_7"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_6"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_6"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_5"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_5"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_4"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_4"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_3"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_3"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "site"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "species_id_2"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN "species_id_1"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "georef_notes" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "rural_urban" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latlong_source" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_2_id" integer`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_2" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_1" character varying`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_level" integer`);
        await queryRunner.query(`ALTER TABLE "site" ADD "gaul_code" integer`);
        await queryRunner.query(`ALTER TABLE "site" ADD "map_site" integer`);
        await queryRunner.query(`ALTER TABLE "site" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "id_method_3" character varying`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "id_method_2" character varying`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "id_method_1" character varying`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "assi_notes" character varying`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "assi" boolean`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD "ss_sl" character varying`);
    }

}
