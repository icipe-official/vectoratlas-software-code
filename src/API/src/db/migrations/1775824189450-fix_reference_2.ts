import { MigrationInterface, QueryRunner } from "typeorm";

export class FixReference21775824189450 implements MigrationInterface {
    name = 'FixReference21775824189450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_occurrence_reference"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_bionomics_reference"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_exportJob_requestHash"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_exportJob_status"`);
        await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT "UQ_4810e019782e479affcc37578a7"`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_c16633f8b002bd154c433959095"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_69457bf7344e306225f91c5bb76"`);
        await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "UQ_4810e019782e479affcc37578a7" UNIQUE ("num_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_exportJob_status" ON "exportJob" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_exportJob_requestHash" ON "exportJob" ("requestHash") `);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_bionomics_reference" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_occurrence_reference" FOREIGN KEY ("referenceId") REFERENCES "reference"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
