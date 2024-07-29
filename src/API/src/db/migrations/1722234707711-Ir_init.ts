import { MigrationInterface, QueryRunner } from "typeorm";

export class IrInit1722234707711 implements MigrationInterface {
    name = 'IrInit1722234707711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genotypicRepresentativeness" ("id" character varying(256) NOT NULL, "gen_test_rep_site" character varying, "gen_test_rep_site_dis" character varying, "minor_spec_miss_alle_freq_data" character varying, "notes_population_rep" character varying, "gen_sample_first_bio_tests" character varying, "gen_sample_link_spec_bio" character varying, "bio_subsample_used_gen_test" character varying, "notes_on_bioessay_linkage" character varying, CONSTRAINT "PK_4ae577df943b4eac3def01d0270" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "insecticideResistanceBioassays" ("id" character varying(256) NOT NULL, "bio_rep_complex_site" character varying, "bio_rep_complex_site_disaggregated" character varying, "generation" character varying, "wild_caught_larvae_adults" character varying, "lower_age_days" character varying, "upper_age_days" character varying, "test_protocal" character varying, "insecticide_tested" character varying, "insecticide_class" character varying, "irac_moa" character varying, "irac_moa_code" character varying, "concentration_percent" character varying, "concentration_microgram" character varying, "exposure_period_min" character varying, "intensity_multiplier" character varying, "synergist_tested" character varying, "synergist_concentration" character varying, "synergist_concentration_unit" character varying, "mosquitors_tested_n" character varying, "mosquitors_dead_n" character varying, "percent_mortality" character varying, "knock_down_expo_time_min" character varying, "no_mosq_knock_down" character varying, "knock_down_percent" character varying, "ktd_50_percent_min" character varying, "ktd_90_percent_min" character varying, "ktd_95_percent_min" character varying, "bioassay_notes" character varying, "genotypicRepresentativenessId" character varying(256), CONSTRAINT "REL_9a0f87904bbee0a3f6c9a5e117" UNIQUE ("genotypicRepresentativenessId"), CONSTRAINT "PK_a5650949f3b807083f133eace1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_9a0f87904bbee0a3f6c9a5e1174" FOREIGN KEY ("genotypicRepresentativenessId") REFERENCES "genotypicRepresentativeness"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_9a0f87904bbee0a3f6c9a5e1174"`);
        await queryRunner.query(`DROP TABLE "insecticideResistanceBioassays"`);
        await queryRunner.query(`DROP TABLE "genotypicRepresentativeness"`);
    }

}
