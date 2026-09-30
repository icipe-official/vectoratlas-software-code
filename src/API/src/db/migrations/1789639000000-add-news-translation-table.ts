import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewsTranslationTable1789639000000
  implements MigrationInterface
{
  name = 'AddNewsTranslationTable1789639000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Make news columns nullable to match the entity definition.
    // The news entity has title, summary, article as nullable: true
    // because when translations are used, the base news record may
    // not have content in every field.
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "summary" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "article" DROP NOT NULL`,
    );

    // 2. Create the news_translation table.
    // Stores per-locale translations of news articles.
    // FK to news(id) with ON DELETE CASCADE — deleting a news article
    // automatically removes all its translations.
    await queryRunner.query(
      `CREATE TABLE "news_translation" (
        "id" SERIAL PRIMARY KEY,
        "news_id" varchar(256) NOT NULL,
        "locale" varchar(5) NOT NULL,
        "title" varchar(500),
        "summary" varchar,
        "article" text,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        CONSTRAINT "news_translation_news_id_fkey"
          FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE CASCADE
      )`,
    );

    // 3. Indexes
    // Unique constraint: one translation per locale per news article
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_news_locale"
        ON "news_translation" ("news_id", "locale")`,
    );
    // Lookup index for finding all translations of a news article
    await queryRunner.query(
      `CREATE INDEX "idx_news_translation_news_id"
        ON "news_translation" ("news_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(
      `DROP INDEX "idx_news_translation_news_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "uq_news_locale"`,
    );

    // Drop the table
    await queryRunner.query(`DROP TABLE "news_translation"`);

    // Restore NOT NULL constraints on news columns
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "article" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "summary" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "title" SET NOT NULL`,
    );
  }
}
