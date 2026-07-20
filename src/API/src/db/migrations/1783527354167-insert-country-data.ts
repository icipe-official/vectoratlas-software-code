import { MigrationInterface, QueryRunner } from 'typeorm';
import { SANITIZED_COUNTRIES } from '../country/country.data';

export class InsertCountryData1783527354167 implements MigrationInterface {
  name = 'InsertCountryData1783527354167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sanitizedCountries = SANITIZED_COUNTRIES;

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('country')
      .values(sanitizedCountries)
      .orIgnore() // Generates ON CONFLICT DO NOTHING for supported databases. makes the migration idempotent
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('country')
      .where('id IN (:...ids)', {
        ids: SANITIZED_COUNTRIES.map((country) => country.id),
      })
      .execute();
  }
}
