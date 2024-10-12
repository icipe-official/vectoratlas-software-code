import { MigrationInterface, QueryRunner } from "typeorm";

export class DatasetLastStatusUpdateDate1727931988283 implements MigrationInterface {
    name = 'DatasetLastStatusUpdateDate1727931988283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "last_status_update_date" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "last_status_update_date" DROP DEFAULT`);
    }

}
