import { MigrationInterface, QueryRunner } from "typeorm";

export class occurrence1661346301410 implements MigrationInterface {
    name = 'occurrence1661346301410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sample" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mossamp_tech_1" character varying(50) NOT NULL, "n_1" integer NOT NULL, "mossamp_tech_2" character varying(50) NOT NULL, "n_2" integer NOT NULL, "mossamp_tech_3" character varying(50) NOT NULL, "n_3" integer NOT NULL, "mossamp_tech_4" character varying(50) NOT NULL, "n_4" integer NOT NULL, "n_all" integer NOT NULL, "mos_id_1" character varying(20) NOT NULL, "mos_id_2" character varying(20) NOT NULL, "mos_id_3" character varying(20) NOT NULL, "mos_id_4" character varying(20) NOT NULL, "control" boolean NOT NULL, "control_type" character varying(20) NOT NULL, CONSTRAINT "PK_1e92238b098b5a4d13f6422cba7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "occurrence" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "month_start" integer NOT NULL, "year_start" integer NOT NULL, "month_end" integer NOT NULL, "year_end" integer NOT NULL, "dec_id" character varying(20) NOT NULL, "dec_check" character varying(20) NOT NULL, "map_check" character varying(20) NOT NULL, "vector_notes" character varying(10485760) NOT NULL, "referenceId" uuid NOT NULL, "siteId" uuid NOT NULL, "speciesId" uuid NOT NULL, "sampleId" uuid NOT NULL, CONSTRAINT "PK_db678abc0d87805e345ee35279a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_c8affe6c11913c6e36211174267" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_4823840f77c01c8be609169e940" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES "sample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_c77d571e529448a04a283924c17"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_4823840f77c01c8be609169e940"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_c8affe6c11913c6e36211174267"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_69457bf7344e306225f91c5bb76"`);
        await queryRunner.query(`DROP TABLE "occurrence"`);
        await queryRunner.query(`DROP TABLE "sample"`);
    }

}
