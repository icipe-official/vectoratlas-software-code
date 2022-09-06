import { MigrationInterface, QueryRunner } from "typeorm";

export class occurrenceSampleNull1662468391570 implements MigrationInterface {
    name = 'occurrenceSampleNull1662468391570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_c77d571e529448a04a283924c17"`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "sampleId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES "sample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_c77d571e529448a04a283924c17"`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "sampleId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES "sample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
