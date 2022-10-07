# Developer How-To

This document is intended as a guide to developers, explaining how to implement the most common features.

## Get data from graphql in the UI
1. Add your graphql query to the `UI/api/queries` file, ensuring first that it successfully retrieves data from the graphql playground (`http://localhost:3001/graphql`)
1. Add the data format to the interface and initial state of the relevant `UI/state/**Slice.ts` file, if it exists. If not, create the file. An example of this is the `site_locations` data in `mapSlice.ts`
1. Add an async thunk for getting the data to the slice file. This should call the `fetchGraphQlData` method of the api class, passing in the query from the `queries` file. Also add this thunk to the extraReducers section of the createSlice method. An example of this is the `getOccurrenceData` method in `mapSlice.ts`.
1. Add a call to this action in the appropriate component/page, in a `useEffect`. An example of this is the call to `getOccurrenceData` at the top of the `components/map/map.tsx` component
1. Where the data is needed, get it from the store with the `useAppSelector` method. An example of this is `const occurrenceData = useAppSelector(state => state.map.occurrence_data);` at the top of the `components/map/map.tsx` component.
