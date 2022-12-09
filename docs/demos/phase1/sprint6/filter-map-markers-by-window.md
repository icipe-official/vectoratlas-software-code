# Map Updates

## Stories covered
- [100. Filter map markers by location window](https://github.com/icipe-official/vectoratlas-software-code/issues/100)


# Prior to demo
1. Ensure test data has been uploaded into the database. Otherwise, no points to filter
1. A quick review of the image here may be of use https://github.com/icipe-official/vectoratlas-software-code/pull/283

## Demo
1. Check out the `main` branch.
1. Visit the api playgrouund at http://localhost:3001/graphql 
1. Using the image mentioned in the "Prior to Demo" section, address the impetus for this feature. Explain that it allows for area selection of arbitray shape and size. Potential for basic draw tooling
1. Using the query below should allow filtering of all Africa and a small slice on the West of the continent - NOTE// Adjust the country filters as necessary

```
query Occurrence {
   OccurrenceData(skip:0, take:4, filters: {},
    bounds: {
      locationWindowActive: true,
      # ALL Africa
    	 # coords: [{lat: 56.16214352659835, long: -58.76673868619071}, {lat: 45.69368143165873, long: 95.25525903701417}, 
    	 # {lat: -48.34981233146665, long: 107.5238064295175}, {lat: -44.90001562502166, long: -74.582816995981025}
    	 # ]
      # West Africa Slice
    	coords: [{lat: 12.394839283914305, long: -16.516575777435357}, {lat: 13.46559716441185, long: 18.595725696301397}, 
    		{lat: -6.783425256222958, long: 18.815452238690238}, {lat: -7.001563730581878, long: -16.560521085913123}
    	],
    }
  )
   {
      items {
         year_start
         id
         site {
            location
          	country
         }
         sample {
            n_all
         }
         recorded_species {
            species
         }
      }
      total
      hasMore
   }
}
```
