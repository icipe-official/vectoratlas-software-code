export default async function QueryManyAndCount( repository, query ) {
  const [items, total] = await repository.findAndCount(
    { 
    take: query.take || 100,
    skip: query.skip || 0
    }
  );
  return [items, total]
}

// items =  objects in response
// total = total number of occurrences in the repo
