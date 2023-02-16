# Review process

## Stories covered
- 180, 181, 182, 184, 430, 433

## Demo
1. Check out the feature/sprint8-demo-kita branch and get the dev stack, API and UI running
1. Go to the data hub and then the `Upload Data` page
1. Upload the file in /test-data as occurrence data for Vector Atlas, with a DOI
1. Show that the upload was successful, and wait for the email
1. While waiting, attempt to upload again with the same doi - it should fail
1. Once the email has arrived, copy the /review... bit to the local site and show review page
1. Click the download button and show data
1. Fill in the review form and click `REQUEST CHANGES`. Show that the page updates, and wait for the email.
1. Click `APPROVE`. Show that the page updates.
1. Explain the double-review constraint, and change the approvedBy field in the db to 'auth0|637794ea911bc5682940a46a'
1. Refresh the page, show the changed value, click `APPROVE`
1. Show the new state of the page
1. Show the new point in Kenya on the map