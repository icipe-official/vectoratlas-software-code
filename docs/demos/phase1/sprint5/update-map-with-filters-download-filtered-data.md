# Map Updates

## Stories covered
- [107. Update the map to show availble filters and wire in to marker route](https://github.com/icipe-official/vectoratlas-software-code/issues/107)
- [108. Add download data button based on current view selection](https://github.com/icipe-official/vectoratlas-software-code/issues/108)
- [250. Add toast notification on all and filtered downloads](https://github.com/icipe-official/vectoratlas-software-code/issues/250)
- [220. Map not displaying correctly](https://github.com/icipe-official/vectoratlas-software-code/issues/220)

# Prior to demo
1. Ensure test data has been uploaded into the database. Otherwise, no points to filter
1. Be aware that currently the filter is not 100%. Be sure to make this clear. Could be the test data or something in the backend. Also, only filtering on single value.
1. Download filtered data button is still in testing location in drawer. Will be moved into download section.
1. Open state/map/actions/getFilteredData.ts

## Demo
1. Check out the `feature/download-toast-notifications-#250` branch (if not merged)
1. Visit the map page and open up the drawer
1. Show to available filters. The drop downs, the toggles and the date pickers. How does this decision benefit the user?
1. Filter: From Aug 1989 (Then remove). Species: Funestus, Country: Uganda. [Highlight that filter is not fully operational withg toggles]
1. With that final species-location filter active, begin to demo downloads.
1. Explain that Andrew's toastify notification updates have been implemented on the download. Receive download status and success/fail notification
1. Show the download with 500 items. We have less than 500 points in the db so it will be returned in one go.
1. Replace 500 with 5 - and although this is unrealistic, it shows off the download status which will be present for much larger datasets.
1. Download. See status loading and complete.
1. Show off failed. Enter console network tab and turn to offline. Try to download again.
1. Turn off console network throttling
1. Highlight the bug fix for the side of the map. It was not redrawing so we have to call it manually after a time delay. Looks jerky at the moment but should be able to smooth with animations.
