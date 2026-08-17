import { Repository, ObjectLiteral } from 'typeorm';

type RelationTree = Record<string, any>;

export class MetadataRelationBuilder<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Build full relation tree from TypeORM metadata
   */
  buildFullRelationTree(): RelationTree {
    const tree: RelationTree = {};

    for (const relation of this.repository.metadata.relations) {
      this.insertPath(tree, relation.propertyPath.split('.'));
    }

    return tree;
  }

  /**
   * Build safe filtered tree (optional whitelist)
   */
  buildSafeRelationTree(allowed?: string[]): RelationTree {
    const fullTree = this.buildFullRelationTree();

    if (!allowed?.length) {
      return fullTree;
    }

    return this.filterTree(fullTree, allowed);
  }

  private insertPath(tree: RelationTree, parts: string[]) {
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        current[part] = true;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }

  private filterTree(tree: RelationTree, allowed: string[]): RelationTree {
    const result: RelationTree = {};

    for (const path of allowed) {
      const parts = path.split('.');
      let source = tree;
      let target = result;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (!source[part]) {
          break;
        }

        if (i === parts.length - 1) {
          target[part] = true;
        } else {
          target[part] = target[part] || {};
          source = source[part];
          target = target[part];
        }
      }
    }

    return result;
  }
}
