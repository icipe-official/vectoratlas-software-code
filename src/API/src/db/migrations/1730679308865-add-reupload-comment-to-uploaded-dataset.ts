import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReuploadCommentToUploadedDataset1730679308865 implements MigrationInterface {
    name = 'AddReuploadCommentToUploadedDataset1730679308865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "reupload_comment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "reupload_comment"`);
    }

}
