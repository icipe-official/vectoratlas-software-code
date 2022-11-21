# Test data

## Stories covered
- [77. Add a secured API route for creating a new source](https://github.com/icipe-official/vectoratlas-software-code/issues/77)

## Demo
1. Check out the `feature/create-source-api-77` branch (if not merged)
1. Start the db, api and UI running
1. Make sure you are not logged in, and click the `ADD SOURCE` button. Show the unauthorized page.
1. Log in, but as a non-uploader. Refresh the new source page, show unauthorized.
1. Change role in db to uploader, refresh. Show form.
1. Show db with rows count for references
1. Fill in form and submit. Show count has increased, and show new row.
