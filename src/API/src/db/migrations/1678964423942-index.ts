import { MigrationInterface, QueryRunner } from "typeorm";

export class index1678964423942 implements MigrationInterface {
    name = 'index1678964423942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9dbcac2dea14d071c510ae92af" ON "bionomics" ("siteId", "referenceId", "month_start", "month_end", "year_start", "year_end") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9dbcac2dea14d071c510ae92af"`);
    }

}
