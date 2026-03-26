import { MigrationInterface, QueryRunner } from "typeorm";

export class DasetDownload1774531470648 implements MigrationInterface {
    name = 'DasetDownload1774531470648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exportJob" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "requestHash" character varying, "filtersJson" jsonb, "generateDoi" boolean NOT NULL DEFAULT false, "downloaderName" character varying, "downloaderEmail" character varying, "status" character varying NOT NULL DEFAULT 'queued', "progress" integer NOT NULL DEFAULT 0, "fileName" character varying, "blobPath" text, "errorMessage" text, "startedAt" TIMESTAMP, "completedAt" TIMESTAMP, "expiresAt" TIMESTAMP, CONSTRAINT "PK_7a09dbc645fe4118443104bd531" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_933c7655907015d0bcd6dffc50" ON "exportJob" ("requestHash") `);
        await queryRunner.query(`CREATE INDEX "IDX_adc6f6299c51a28d4c4183f502" ON "exportJob" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_adc6f6299c51a28d4c4183f502"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_933c7655907015d0bcd6dffc50"`);
        await queryRunner.query(`DROP TABLE "exportJob"`);
    }

}
