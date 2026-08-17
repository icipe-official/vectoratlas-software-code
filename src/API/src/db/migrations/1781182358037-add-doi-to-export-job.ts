import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDoiToExportJob1781182358037 implements MigrationInterface {
  name = 'AddDoiToExportJob1781182358037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doi" ADD "export_job" character varying(256)`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ADD CONSTRAINT "UQ_dc4cd01d873a1effae625189a3c" UNIQUE ("export_job")`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ADD CONSTRAINT "FK_dc4cd01d873a1effae625189a3c" FOREIGN KEY ("export_job") REFERENCES "exportJob"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doi" DROP CONSTRAINT "FK_dc4cd01d873a1effae625189a3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" DROP CONSTRAINT "UQ_dc4cd01d873a1effae625189a3c"`,
    );
    await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "export_job"`);
  }
}
