const fs = require('fs');

const lakeData = JSON.parse(fs.readFileSync('lakes.geojson', { encoding: 'utf8'}))
const lakeData2 = JSON.parse(fs.readFileSync('lakes2.geojson', { encoding: 'utf8'}))
const lakeData3 = JSON.parse(fs.readFileSync('lakes3.geojson', { encoding: 'utf8'}))

const allLakeData = [...lakeData.features, ...lakeData2.features, ...lakeData3.features]

const allIds = allLakeData.map(f => f.id);

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

const duplicateIds = [...new Set(findDuplicates(allIds))];
console.log(duplicateIds)

const allUniqueLakeData = allLakeData.filter(f => duplicateIds.indexOf(f.id) == -1);
const dedupedDuplicates = duplicateIds.map(id => allLakeData.find(f => f.id === id))

lakeData.features = [...allUniqueLakeData, ...dedupedDuplicates]

fs.writeFileSync('allLakes.geojson', JSON.stringify(lakeData))
