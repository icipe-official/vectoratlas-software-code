import { Injectable } from '@nestjs/common';
import { DataSource, In, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
/**
 * See https://gemini.google.com/app/b46cbee50bf1e574
 */
export class DynamicQueryService {
  constructor(private readonly datasource: DataSource) {}

  /**
   * This works ok but when the tables are many, we hit the 1644 columns error in Postgres
   * @param entityTarget
   * @param maxDepth
   * @returns
   */
  public buildSafeDynamicJoins<T extends ObjectLiteral>(
    entityTarget: new () => T,
    maxDepth = 3,
  ): {
    queryBuilder: SelectQueryBuilder<T>;
    aliasMap: Record<string, string>;
    columnCountMap: Record<string, number>;
  } {
    const metadata = this.datasource.getMetadata(entityTarget);
    const baseAlias = metadata.tableName; // Root table name

    const queryBuilder = this.datasource
      .getRepository(entityTarget)
      .createQueryBuilder(baseAlias);

    const visited = new Set<string>();

    // Maps readable paths like "company.departments.teams" to safe aliases like "as_8f3a1b"
    const aliasMap: Record<string, string> = {
      [baseAlias]: baseAlias,
    };

    // 1. Initialize the column counter map with the base root entity
    const columnCountMap: Record<string, number> = {
      [baseAlias]: metadata.columns.length,
    };

    // Helper to generte a short, Postgres-safe 12-character alias
    const generateSafeAlias = (path: string): string => {
      const hash = crypto
        .createHash('md5')
        .update(path)
        .digest('hex')
        .substring(0, 8);
      return `as_${hash}`;
    };

    const discoverAndJoin = (
      currentMetadata: any,
      parentPath: string, // Full logical path e.g "company.departments"
      parentAlias: string, // Safe Postgres alias e.g as_8f3a1b
      currentDepth: number,
    ) => {
      if (currentDepth > maxDepth) return;

      for (const relation of currentMetadata.relations) {
        const currentPath = `${parentPath}.${relation.propertyName}`;
        const propertyJoinPath = `${parentAlias}.${relation.propertyName}`;

        if (visited.has(currentPath)) {
          // Prevent infinite loops in circular relationships (e.g., Self-referencing tables)
          continue;
        }
        visited.add(currentPath);

        // Generate a guaranteed short alias (< 15 chars)
        const safeChildAlias = generateSafeAlias(currentPath);
        aliasMap[currentPath] = safeChildAlias;

        // Perform the join using the parent's short alias and assigning the child's short alias
        queryBuilder.leftJoinAndSelect(propertyJoinPath, safeChildAlias);

        // Recursively dive into the next nested table's metadata
        if (relation.inverseEntityMetadata) {
          const tableName = relation.inverseEntityMetadata.tableName;
          const columns = relation.inverseEntityMetadata.columns;
          console.log(
            `Cols Total. Table ${tableName}. Total=${columns.length}`,
          );

          // Save column counts to our tracking object
          // If a table is joined multiple times along different paths, we accumulate or log it uniquely
          columnCountMap[`${tableName}=${currentPath}`] = columns.length;

          discoverAndJoin(
            relation.inverseEntityMetadata,
            currentPath,
            safeChildAlias,
            currentDepth + 1,
          );
        }
      }
    };

    // Start recursion
    discoverAndJoin(metadata, baseAlias, baseAlias, 1);

    return { queryBuilder, aliasMap, columnCountMap };
  }

  /**
   * Pass 1: Builds a query that joins everything dynamically to filter,
   * but ONLY returns the primary IDs of the root table.
   * Build a hyper-lean query that joins all tables dynamically, but only selects primary keys.
   * It applies all your dynamic filters across the nested graph and returns just a list of Root IDs matching the search criteria
   */
  public buildDynamicIdSearcher<T extends ObjectLiteral>(
    entityTarget: new () => T,
    maxDepth = 3,
  ) {
    const metadata = this.datasource.getMetadata(entityTarget);
    const baseAlias = metadata.tableName;
    const primaryKeyName = metadata.primaryColumns[0].propertyName;

    // Create query builder and ONLY select the root table's primary key
    const queryBuilder = this.datasource
      .getRepository(entityTarget)
      .createQueryBuilder(baseAlias)
      .select(`${baseAlias}.${primaryKeyName}`); // Keeps target list tiny (1 column!)

    const visited = new Set<string>();
    const aliasMap: Record<string, string> = { [baseAlias]: baseAlias };

    const generateSafeAlias = (path: string): string => {
      const hash = crypto
        .createHash('md5')
        .update(path)
        .digest('hex')
        .substring(0, 8);
      return `as_${hash}`;
    };

    const discoverAndJoin = (
      currentMetadata: any,
      parentPath: string,
      parentAlias: string,
      currentDepth: number,
    ) => {
      if (currentDepth > maxDepth) return;

      for (const relation of currentMetadata.relations) {
        const currentPath = `${parentPath}.${relation.propertyName}`;
        const propertyJoinPath = `${parentAlias}.${relation.propertyName}`;

        if (visited.has(currentPath)) continue;

        visited.add(currentPath);

        const safeChildAlias = generateSafeAlias(currentPath);
        aliasMap[currentPath] = safeChildAlias;

        // Use standard leftJoin (NOT leftJoinAndSelect).
        // We do NOT add any columns to select list.

        queryBuilder.leftJoin(propertyJoinPath, safeChildAlias);

        if (relation.inverseEntityMetadata) {
          discoverAndJoin(
            relation.inverseEntityMetadata,
            currentPath,
            safeChildAlias,
            currentDepth + 1,
          );
        }
      }
    };

    discoverAndJoin(metadata, baseAlias, baseAlias, 1);

    return { queryBuilder, aliasMap, primaryKeyName };
  }

  /**
   * Helper method to dynamically discover relation paths
   * Automatically maps out all relation pathways up to N depth as string paths
   * e.g., ['departments', 'departments.teams', 'departments.teams.employees']
   */
  public getDynamicRelationPaths<T extends ObjectLiteral>(
    entityTarget: new () => T,
    maxDepth = 3,
  ): string[] {
    const metadata = this.datasource.getMetadata(entityTarget);
    const paths: string[] = [];

    const traverse = (
      currentMetadata: any,
      currentPath: string,
      currentDepth: number,
    ) => {
      if (currentDepth > maxDepth) return;

      for (const relation of currentMetadata.relations) {
        const nextPath = currentPath
          ? `${currentPath}.${relation.propertyName}`
          : relation.propertyName;

        paths.push(nextPath);

        if (relation.inverseEntityMetadata) {
          traverse(relation.inverseEntityMetadata, nextPath, currentDepth + 1);
        }
      }
    };

    traverse(metadata, '', 1);
    return paths;
  }

  /**
   * Pass 1 & 2: Optimized Dynamic Search using EXISTS Subqueries
   * * 💡 Added `<T extends ObjectLiteral>` right after the method name
   * so TypeScript knows 'T' represents a valid TypeORM Entity.
   */
  async optimizedDynamicSearch<T extends ObjectLiteral>(
    entityTarget: new () => T,
    filters: Record<string, any>,
  ): Promise<T[]> {
    // Explicitly typed to return an array of the entity

    // ==========================================
    // PASS 1: Execute ID Search
    // ==========================================

    const metadata = this.datasource.getMetadata(entityTarget);
    const baseAlias = metadata.tableName;
    const primaryKeyName = metadata.primaryColumns[0].propertyName;

    // Start with a clean base query targeting ONLY the root table
    const queryBuilder = this.datasource
      .getRepository(entityTarget)
      .createQueryBuilder(baseAlias)
      .select(`${baseAlias}.${primaryKeyName}`);

    let paramCounter = 0;

    // Create a central repository for ALL query parameters
    const globalParams: Record<string, any> = {};

    // Loop over the dynamic filters provided
    Object.keys(filters).forEach((filterPath) => {
      const value = filters[filterPath];
      if (value === undefined || value === null) return;

      const segments = filterPath.split('.');
      const columnName = segments.pop();
      segments.shift(); // Remove root alias

      // Context 1: Top level table filter
      if (segments.length === 0) {
        const paramName = `base_param_${paramCounter++}`;
        queryBuilder.andWhere(`${baseAlias}.${columnName} ILIKE :${paramName}`);

        // FIX 1: Save parameters to global object instead of immediate execution
        globalParams[paramName] = `%${value}%`;
        return;
      }

      // Context 2: Nested table filter (EXISTS subqueries)
      let subQueryWrapper = '';
      let closingBrackets = '';
      let currentMetadata = metadata;

      segments.forEach((segment, index) => {
        const relation = currentMetadata.relations.find(
          (r) => r.propertyName === segment,
        );
        if (!relation) return; // Guard against bad filter paths

        const targetTable = relation.inverseEntityMetadata.tableName;
        const targetAlias = `sub_${targetTable}_${index}_${paramCounter}`;

        const parentKey = relation.isOwning
          ? relation.joinColumns[0].referencedColumn.propertyName
          : currentMetadata.primaryColumns[0].propertyName;
        const childKey = relation.isOwning
          ? relation.joinColumns[0].propertyName
          : relation.inverseRelation?.joinColumns[0].propertyName ||
            `${currentMetadata.tableName}Id`;

        const parentAliasContext =
          index === 0
            ? baseAlias
            : `sub_${currentMetadata.tableName}_${index - 1}_${paramCounter}`;

        subQueryWrapper += `EXISTS (SELECT 1 FROM "${targetTable}" "${targetAlias}" WHERE "${targetAlias}"."${childKey}" = "${parentAliasContext}"."${parentKey}" AND `;
        closingBrackets += ')';

        currentMetadata = relation.inverseEntityMetadata;
      });

      const deepAlias = `sub_${currentMetadata.tableName}_${
        segments.length - 1
      }_${paramCounter}`;
      const finalParamName = `deep_param_${paramCounter++}`;

      subQueryWrapper += `"${deepAlias}"."${columnName}" ILIKE :${finalParamName}${closingBrackets}`;

      queryBuilder.andWhere(subQueryWrapper);

      // FIX 2: Store the parameter cleanly to be set later
      globalParams[finalParamName] = `%${value}%`;
    });

    // FIX 3: Inject ALL accumulated parameters explicitly right before calling getMany()
    queryBuilder.setParameters(globalParams);

    // ==========================================
    // DEBUG TOOL: Use this to track down parameters if errors persist
    // ==========================================
    const [sql, parameters] = queryBuilder.getQueryAndParameters();
    // console.log('SQL TO EXECUTE:', sql);
    // console.log('PARAMETERS GENERATED:', parameters);

    // Execute Pass 1: Grab matched IDs safely and quickly
    const matchedRecords = await queryBuilder.getMany();
    const matchedIds = matchedRecords.map(
      (record) => record[primaryKeyName as keyof typeof record],
    );

    if (!matchedIds || matchedIds.length === 0) return [];

    // ==========================================
    // PASS 2: Hydrate Full Records
    // ==========================================

    // Pass 2: Hydrate full records safely using TypeORM find options
    const dynamicRelations = this.getDynamicRelationPaths(entityTarget, 3);

    // 2. Get a completely FRESH repository instance to clear metadata states
    // Ensure that Pass 2 runs on a completely clean, isolated repository instance that has no memory of Pass 1's parameter context
    const freshRepository = this.datasource.getRepository(entityTarget);

    // 3. Force clean parameter binding by avoiding state contamination
    // return await freshRepository.find({
    //   where: { [primaryKeyName]: In(matchedIds) } as any,
    //   relations: dynamicRelations,
    //   // Splitting the strategy here prevents Postgres from crashing on column numbers ceilings
    //   relationLoadStrategy: 'query',
    // });

    const ds = await freshRepository.find({
      where: { [primaryKeyName]: In([matchedIds[0]]) } as any,
      relations: dynamicRelations,
      loadRelationIds: true,
      // Splitting the strategy here prevents Postgres from crashing on column numbers ceilings
      relationLoadStrategy: 'query',
    });
    return ds;

    // // ==========================================
    // // PASS 2: Hydrate Full Records (THE DEFINITIVE1 FIX)
    // // ==========================================
    // const dynamicRelations = this.getDynamicRelationPaths(entityTarget, 3);

    // // 1. Start a fresh query builder completely isolated from Pass 1 parameters
    // const freshQueryBuilder = this.datasource
    //   .getRepository(entityTarget)
    //   .createQueryBuilder(baseAlias);

    // // 2. Track already joined aliases and store an index map of paths to hashes
    // const joinedAliases = new Set<string>();
    // const hydrationAliasMap: Record<string, string> = {
    //   [baseAlias]: baseAlias,
    // };

    // // Helper function to generate an absolute unique hash based on the relationship string path
    // const generateHydrationHash = (path: string): string => {
    //   const hash = crypto
    //     .createHash('md5')
    //     .update(path)
    //     .digest('hex')
    //     .substring(0, 8);
    //   return `hyd_${hash}`;
    // };

    // dynamicRelations.forEach((relationPath) => {
    //   const pathSegments = relationPath.split('.');
    //   const relationName = pathSegments.pop(); // e.g., 'teams'

    //   // Reconstruct the parent path context to find its matching hash alias
    //   // If no parent path segments remain, the parent is the root baseAlias
    //   const parentPath =
    //     pathSegments.length === 0
    //       ? baseAlias
    //       : `${baseAlias}.${pathSegments.join('.')}`;
    //   const parentAlias = hydrationAliasMap[parentPath] || baseAlias;

    //   // Generate a totally unique hash for the current child path strand
    //   const currentFullPath = `${baseAlias}.${relationPath}`;
    //   const childAlias = generateHydrationHash(currentFullPath);

    //   // Save this hash to the map so deeper recursive children can look it up as their parent
    //   hydrationAliasMap[currentFullPath] = childAlias;

    //   // Prevent duplicate joins on branching metadata lines
    //   if (!joinedAliases.has(childAlias)) {
    //     joinedAliases.add(childAlias);

    //     // 👇 The Join is now executed using 100% abstract, anonymous hashed aliases
    //     // Example: freshQueryBuilder.leftJoinAndSelect("hyd_7a8f1b2c.teams", "hyd_e4d9c2b1")
    //     freshQueryBuilder.leftJoinAndSelect(
    //       `${parentAlias}.${relationName}`,
    //       childAlias,
    //     );
    //   }
    // });

    // // 3. Execute the clean query filtering only by the small subset of matched IDs
    // const res = await freshQueryBuilder
    //   .where(`${baseAlias}.${primaryKeyName} IN (:...matchedIds)`, {
    //     matchedIds,
    //   })
    //   .getMany();
    // return res;
  }

  async optimizedDynamicSearch2<T extends ObjectLiteral>(
    entityTarget: new () => T,
    filters: Record<string, any>,
  ): Promise<T[]> {
    const metadata = this.datasource.getMetadata(entityTarget);
    const baseAlias = metadata.tableName;
    const primaryKeyName = metadata.primaryColumns[0].propertyName;

    // =========================================================================
    // PASS 1: NATIVE SUBQUERY EXISTENTIAL SEARCH
    // =========================================================================
    const queryBuilder = this.datasource
      .getRepository(entityTarget)
      .createQueryBuilder(baseAlias)
      .select([`${baseAlias}.${primaryKeyName}`]);

    let paramCounter = 0;

    Object.keys(filters).forEach((filterPath) => {
      const value = filters[filterPath];
      if (value === undefined || value === null || value === '') return;

      const segments = filterPath.split('.');
      const columnName = segments.pop();
      segments.shift();

      // Case 1: Simple base table filter
      if (segments.length === 0) {
        const paramName = `base_param_${paramCounter++}`;
        queryBuilder.andWhere(
          `${baseAlias}.${columnName} ILIKE :${paramName}`,
          {
            [paramName]: `%${value}%`,
          },
        );
        return;
      }

      // Case 2: Nested table filter using TypeORM's native subquery engine
      const paramName = `deep_param_${paramCounter++}`;

      // 🧠 THE FIX: Cast 'qb' as SelectQueryBuilder<any> inside the callback signature
      queryBuilder.andWhere((qb: SelectQueryBuilder<any>) => {
        let datasource = qb;
        let currentMetadata = metadata;
        let parentAliasContext = baseAlias;

        segments.forEach((segment, index) => {
          const relation = currentMetadata.relations.find(
            (r) => r.propertyName === segment,
          );
          if (!relation) return;

          const targetTable = relation.inverseEntityMetadata.tableName;
          const targetAlias = `sub_${targetTable}_${index}_${paramCounter}`;

          const parentKey = relation.isOwning
            ? relation.joinColumns[0].referencedColumn.propertyName
            : currentMetadata.primaryColumns[0].propertyName;

          const childKey = relation.isOwning
            ? relation.joinColumns[0].propertyName
            : relation.inverseRelation?.joinColumns[0].propertyName ||
              `${currentMetadata.tableName}Id`;

          const subQb = datasource
            .subQuery()
            .select('1')
            .from(targetTable, targetAlias)
            .where(
              `"${targetAlias}"."${childKey}" = "${parentAliasContext}"."${parentKey}"`,
            );

          if (index === segments.length - 1) {
            subQb.andWhere(
              `"${targetAlias}"."${columnName}" ILIKE :${paramName}`,
              {
                [paramName]: `%${value}%`,
              },
            );
          }

          datasource.andWhere(`EXISTS ${subQb.getQuery()}`);

          datasource = subQb;
          parentAliasContext = targetAlias;
          currentMetadata = relation.inverseEntityMetadata;
        });

        // 🧠 ALTERNATIVE SAFETY CAST: Force TypeScript to acknowledge the raw query string output
        return qb.getQuery() as any;
      }, queryBuilder.getParameters());
    });

    // Execute Pass 1
    const matchedRecords = await queryBuilder.getMany();
    const matchedIds = matchedRecords.map(
      (record) => record[primaryKeyName as keyof typeof record],
    );

    if (matchedIds.length === 0) return [];

    // =========================================================================
    // PASS 2: FULLY DECOUPLED STRIPED HYDRATION
    // =========================================================================
    const rootEntities = await this.datasource
      .getRepository(entityTarget)
      .find({
        where: { [primaryKeyName]: In(matchedIds) } as any,
      });

    const dynamicRelations = this.getDynamicRelationPaths(entityTarget, 3);
    const sortedRelationPaths = dynamicRelations.sort(
      (a, b) => a.split('.').length - b.split('.').length,
    );

    for (const relationPath of sortedRelationPaths) {
      const pathSegments = relationPath.split('.');

      let currentMetadata = metadata;
      for (const segment of pathSegments) {
        const relation = currentMetadata.relations.find(
          (r) => r.propertyName === segment,
        );
        if (relation) currentMetadata = relation.inverseEntityMetadata;
      }

      let parents: any[] = rootEntities;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        const segment = pathSegments[i];
        parents = parents
          .flatMap((p) => p[segment] || [])
          .filter((p) => p !== null && p !== undefined);
      }

      if (parents.length === 0) continue;

      const currentRelationName = pathSegments[pathSegments.length - 1];
      const parentRelationMetadata = this.datasource
        .getMetadata(parents[0].constructor)
        .relations.find((r) => r.propertyName === currentRelationName);

      if (!parentRelationMetadata) continue;

      const targetChildEntity =
        parentRelationMetadata.inverseEntityMetadata.target;
      const parentPrimaryColumn =
        parentRelationMetadata.entityMetadata.primaryColumns[0].propertyName;

      let foreignKeyName = '';
      if (
        parentRelationMetadata.isManyToOne ||
        parentRelationMetadata.isOneToOneOwner
      ) {
        foreignKeyName = parentRelationMetadata.joinColumns[0].propertyName;
      } else if (parentRelationMetadata.isOneToMany) {
        foreignKeyName =
          parentRelationMetadata.inverseRelation!.joinColumns[0].propertyName;
      } else {
        foreignKeyName = `${parentRelationMetadata.entityMetadata.tableName}Id`;
      }

      const parentIds = parents.map((p) => p[parentPrimaryColumn]);

      const children = await this.datasource
        .getRepository(targetChildEntity)
        .find({
          where: { [foreignKeyName]: In(parentIds) } as any,
        });

      parents.forEach((parent) => {
        const matchingChildren = children.filter(
          (child) =>
            child[foreignKeyName as keyof typeof child] ===
            parent[parentPrimaryColumn],
        );

        if (
          parentRelationMetadata.isOneToMany ||
          parentRelationMetadata.isManyToMany
        ) {
          parent[currentRelationName] = matchingChildren;
        } else {
          parent[currentRelationName] = matchingChildren[0] || null;
        }
      });
    }

    return rootEntities;
  }

  public getDynamicRelationPaths2<T extends ObjectLiteral>(
    entityTarget: new () => T,
    maxDepth = 3,
  ): string[] {
    const metadata = this.datasource.getMetadata(entityTarget);
    const paths: string[] = [];
    const traverse = (
      currentMetadata: any,
      currentPath: string,
      currentDepth: number,
    ) => {
      if (currentDepth > maxDepth) return;
      for (const relation of currentMetadata.relations) {
        const nextPath = currentPath
          ? `${currentPath}.${relation.propertyName}`
          : relation.propertyName;
        paths.push(nextPath);
        if (relation.inverseEntityMetadata) {
          traverse(relation.inverseEntityMetadata, nextPath, currentDepth + 1);
        }
      }
    };
    traverse(metadata, '', 1);
    return paths;
  }
}
