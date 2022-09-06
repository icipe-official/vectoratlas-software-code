import { MigrationInterface, QueryRunner } from "typeorm";

export class occurrenceSample1662379803351 implements MigrationInterface {
    name = 'occurrenceSample1662379803351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_c77d571e529448a04a283924c17"`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "UQ_c77d571e529448a04a283924c17" UNIQUE ("sampleId")`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES "sample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_c77d571e529448a04a283924c17"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "UQ_c77d571e529448a04a283924c17"`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES "sample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
