import { Reference } from "src/db/shared/entities/reference.entity";

export const mapBionomicsReference = (bionomics): Partial<Reference> => {
  return {
    author: bionomics.Author,
    article_title: bionomics['Article title'],
    journal_title: bionomics['Journal title'],
    year: bionomics.Year,
  }
}