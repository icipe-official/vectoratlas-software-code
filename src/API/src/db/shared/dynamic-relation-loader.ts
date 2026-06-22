import { ObjectLiteral, Repository } from 'typeorm';
import { MetadataRelationBuilder } from './dynamic-relation-builder';

type RelationTree = Record<string, any>;
export class DynamicRelationLoader<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async find(options?: any): Promise<T[]> {
    const entities = await this.repository.find({
      ...options,
    });

    if (!entities.length) {
      return entities;
    }

    const builder = new MetadataRelationBuilder(this.repository);

    const relations = builder.buildFullRelationTree();

    await this.loadRelationsBatch(entities, relations, this.repository);

    return entities;
  }

  async findOne(id: any): Promise<T | null> {
    const entity = await this.repository.findOne({
      where: { id } as any,
    });

    if (!entity) {
      return null;
    }

    const builder = new MetadataRelationBuilder(this.repository);

    const relations = builder.buildFullRelationTree();

    await this.loadRelationsRecursive([entity], relations, this.repository);

    return entity;
  }

  /**
   * Batch loader (for find)
   */
  private async loadRelationsBatch(
    entities: any[],
    relationTree: RelationTree,
    repository: Repository<any>,
  ) {
    const keys = Object.keys(relationTree);

    for (const relationName of keys) {
      await Promise.all(
        entities.map(async (entity) => {
          const qb = repository
            .createQueryBuilder()
            .relation(repository.metadata.target, relationName)
            .of(entity);

          const relationMeta =
            repository.metadata.findRelationWithPropertyPath(relationName);

          const data =
            relationMeta?.isManyToMany || relationMeta?.isOneToMany
              ? await qb.loadMany()
              : await qb.loadOne();

          entity[relationName] = data;
        }),
      );
    }
  }

  /**
   * Recursive loader (for findOne)
   */
  private async loadRelationsRecursive(
    entities: any[],
    relationTree: RelationTree,
    repository: Repository<any>,
  ) {
    const keys = Object.keys(relationTree);

    for (const key of keys) {
      const childEntities: any[] = [];

      for (const entity of entities) {
        const rel = entity[key];

        if (!rel) continue;

        if (Array.isArray(rel)) {
          childEntities.push(...rel);
        } else {
          childEntities.push(rel);
        }
      }

      if (!childEntities.length) continue;

      const childRepo = repository.manager.getRepository(
        childEntities[0].constructor,
      );

      await this.loadRelationsBatch(
        childEntities,
        relationTree[key],
        childRepo,
      );
    }
  }
}
