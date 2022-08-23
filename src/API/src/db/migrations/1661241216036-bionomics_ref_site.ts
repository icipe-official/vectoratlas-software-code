import { MigrationInterface, QueryRunner } from "typeorm";

export class bionomicsRefSite1661241216036 implements MigrationInterface {
    name = 'bionomicsRefSite1661241216036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying(250) NOT NULL, "name" character varying(250) NOT NULL, "map_site" integer NOT NULL, "location" geometry(Point,4326), "area_type" character varying(50) NOT NULL, "georef_source" character varying(50) NOT NULL, "site_notes" character varying(10485760) NOT NULL, "gaul_code" integer NOT NULL, "admin_level" integer NOT NULL, "georef_notes" character varying(10485760) NOT NULL, "admin_1" character varying(50) NOT NULL, "admin_2" character varying(50) NOT NULL, "admin_3" character varying(50) NOT NULL, "admin_2_id" integer NOT NULL, "location_2" geometry(Point,4326), "latlong_source" character varying(50) NOT NULL, "good_guess" boolean NOT NULL, "bad_guess" boolean NOT NULL, "rural_urban" character varying(50) NOT NULL, "is_forest" boolean NOT NULL, "is_rice" boolean NOT NULL, CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "author" character varying(250) NOT NULL, "article_title" character varying(250) NOT NULL, "journal_title" character varying(250) NOT NULL, "year" integer NOT NULL, "published" boolean NOT NULL, "report_type" character varying(50) NOT NULL, "v_data" boolean NOT NULL, CONSTRAINT "PK_01bacbbdd90839b7dce352e4250" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "referenceId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "siteId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_4440983ad72e1de4e830e586d77" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_4440983ad72e1de4e830e586d77"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_c16633f8b002bd154c433959095"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "siteId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "referenceId"`);
        await queryRunner.query(`DROP TABLE "reference"`);
        await queryRunner.query(`DROP TABLE "site"`);
    }

}
