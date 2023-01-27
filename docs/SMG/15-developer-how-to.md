# Developer How-To

This document is intended as a guide to developers, explaining how to implement the most common features.

## Get data from graphql in the UI
1. Add your graphql query to the `UI/api/queries` file, ensuring first that it successfully retrieves data from the graphql playground (`http://localhost:3001/graphql`)
1. Add the data format to the interface and initial state of the relevant `UI/state/**Slice.ts` file, if it exists. If not, create the file. An example of this is the `site_locations` data in `mapSlice.ts`
1. Add an async thunk for getting the data to the slice file. This should call the `fetchGraphQlData` method of the api class, passing in the query from the `queries` file. Also add this thunk to the extraReducers section of the createSlice method. An example of this is the `getOccurrenceData` method in `mapSlice.ts`.
1. Add a call to this action in the appropriate component/page, in a `useEffect`. An example of this is the call to `getOccurrenceData` at the top of the `components/map/map.tsx` component
1. Where the data is needed, get it from the store with the `useAppSelector` method. An example of this is `const occurrenceData = useAppSelector(state => state.map.occurrence_data);` at the top of the `components/map/map.tsx` component.

## Add content to the help site
The help site serves static content from the `/src/Help/docs` folder. Adding markdown files and any associated images into this folder should make them appear at the /help endpoint.

The pages will display in numeric order - so please name the markdown files and folders accordingly. For example, the folder `02-Uploading data` will appear in the menu after the page `01-intro.md`.

## Add an additional template for mapping
To add a template and mapping for a different data source, do the following:
1. Create a folder under `src/API/public/templates`, with the name of the data source as the folder name.
1. Inside this folder, add csv templates for occurrence and bionomics uploads for that data source, with the names `occurrence.csv` and `bionomics.csv` respectively.
1. Also in this folder, create mapping files for occurrence and bionomics data, called `occurrence-mapping.json` and `bionomics-mapping.json` respectively. These should contain JSON arrays of objects with two properties - "Template-column" containing the column name in the new data format, and "VA-column" containing the name of the vector atlas data that this column maps to. For example, if the new template had column "Name of country" which maps to the "Country" column, this JSON would be:
```
[
  {"VA-column": "Country", "Template-column": "Name of country"}
]
```
1. Build and run the UI and API. The data source should be selectable on the /upload page of the UI, and the template files should be available on the same page.