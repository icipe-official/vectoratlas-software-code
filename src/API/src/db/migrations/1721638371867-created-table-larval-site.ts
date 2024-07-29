import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedTableLarvalSite1721638371867 implements MigrationInterface {
    name = 'CreatedTableLarvalSite1721638371867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Larval_site" ("id" character varying(256) NOT NULL, "larval_instars_found_1" character varying, "larval_habitat_1" character varying, "larval_site_character_1" character varying, "larval_turbidity_1" character varying, "larval_salinity_1" character varying, "larval_vegetation_1" character varying, "larval_shade_1" character varying, "larval_water_current_1" character varying, "larval_size_1" character varying, "larval_depth_1" character varying, "larval_performance_1" character varying, "larval_other_fauna_1" character varying, "larval_control_present_1" character varying, "larval_instars_found_2" character varying, "larval_habitat_2" character varying, "larval_site_character_2" character varying, "larval_turbidity_2" character varying, "larval_salinity_2" character varying, "larval_vegetation_2" character varying, "larval_shade_2" character varying, "larval_water_current_2" character varying, "larval_size_2" character varying, "larval_depth_2" character varying, "larval_performance_2" character varying, "larval_other_fauna_2" character varying, "larval_control_present_2" character varying, "larval_instars_found_3" character varying, "larval_habitat_3" character varying, "larval_site_character_3" character varying, "larval_tubidity_3" character varying, "larval_salinity_3" character varying, "larval_vegetation_3" character varying, "larval_shade_3" character varying, "larval_water_current_3" character varying, "larval_size_3" character varying, "larval_depth_3" character varying, "larval_performance_3" character varying, "larval_other_fauna_3" character varying, "larval_control_present_3" character varying, "larval_notes" character varying, CONSTRAINT "PK_c466f2a12e97e36087f99686ea8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "larvalSiteId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_aa52ec7238f9cc4b065049209af" UNIQUE ("larvalSiteId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_aa52ec7238f9cc4b065049209af" FOREIGN KEY ("larvalSiteId") REFERENCES "Larval_site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_aa52ec7238f9cc4b065049209af"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_aa52ec7238f9cc4b065049209af"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "larvalSiteId"`);
        await queryRunner.query(`DROP TABLE "Larval_site"`);
    }

}
