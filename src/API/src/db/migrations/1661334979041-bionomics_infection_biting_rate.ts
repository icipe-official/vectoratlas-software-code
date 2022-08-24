import { MigrationInterface, QueryRunner } from "typeorm";

export class bionomicsInfectionBitingRate1661334979041 implements MigrationInterface {
    name = 'bionomicsInfectionBitingRate1661334979041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "species" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "species_1" character varying(50) NOT NULL, "ss_sl" character varying(20) NOT NULL, "assi" boolean NOT NULL, "assi_notes" character varying(10485760) NOT NULL, "species_2" character varying(50) NOT NULL, CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "infection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sampling_1" character varying(50) NOT NULL, "sampling_2" character varying(50) NOT NULL, "sampling_3" character varying(50) NOT NULL, "sampling_n" character varying(50) NOT NULL, "ir_by_csp_n_pool" integer NOT NULL, "ir_by_csp_total_pool" integer NOT NULL, "no_per_pool" integer NOT NULL, "ir_by_csp_perc" integer NOT NULL, "sr_by_dissection_n" integer NOT NULL, "sr_by_dissection_total" integer NOT NULL, "sr_by_dissection_perc" integer NOT NULL, "sr_by_csp_n" integer NOT NULL, "sr_by_csp_total" integer NOT NULL, "sr_by_csp_perc" integer NOT NULL, "sr_by_pf_n" integer NOT NULL, "sr_by_pf_total" integer NOT NULL, "sr_by_p_falciparum" integer NOT NULL, "oocyst_n" integer NOT NULL, "oocyst_total" integer NOT NULL, "oocyst_rate" integer NOT NULL, "eir" integer NOT NULL, "eir_period" character varying(20) NOT NULL, "eir_days" integer NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_96f53885cb8e561f8898e3e641b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biting_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hbr_sampling_indoor" character varying(50) NOT NULL, "indoor_hbr" integer NOT NULL, "hbr_sampling_outdoor" character varying(50) NOT NULL, "outdoor_hbr" integer NOT NULL, "hbr_sampling_combined_1" character varying(50) NOT NULL, "hbr_sampling_combined_2" character varying(50) NOT NULL, "hbr_sampling_combined_3" character varying(50) NOT NULL, "hbr_sampling_combined_n" character varying(50) NOT NULL, "combined_hbr" integer NOT NULL, "hbr_unit" character varying(50) NOT NULL, "abr_sampling_combined_1" character varying(50) NOT NULL, "abr_sampling_combined_2" character varying(50) NOT NULL, "abr_sampling_combined_3" character varying(50) NOT NULL, "abr_sampling_combined_n" character varying(50) NOT NULL, "abr" integer NOT NULL, "abr_unit" character varying(50) NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_75651183f2c5e29fd8191426cd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biology" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sampling_1" character varying(50) NOT NULL, "sampling_2" character varying(50) NOT NULL, "sampling_3" character varying(50) NOT NULL, "sampling_n" character varying(50) NOT NULL, "parity_n" integer NOT NULL, "parity_total" integer NOT NULL, "parity_perc" integer NOT NULL, "daily_survival_rate" integer NOT NULL, "fecundity" integer NOT NULL, "gonotrophic_cycle_days" integer NOT NULL, "notes" character varying(10485760) NOT NULL, CONSTRAINT "PK_267213d4d955958ec6ecb053f7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "speciesId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "speciesId"`);
        await queryRunner.query(`DROP TABLE "biology"`);
        await queryRunner.query(`DROP TABLE "biting_rate"`);
        await queryRunner.query(`DROP TABLE "infection"`);
        await queryRunner.query(`DROP TABLE "species"`);
    }

}
