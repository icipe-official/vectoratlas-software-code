import { MigrationInterface, QueryRunner } from "typeorm";

export class downloadCount1674487763921 implements MigrationInterface {
    name = 'downloadCount1674487763921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "download_count" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "download_count"`);
    }

}
