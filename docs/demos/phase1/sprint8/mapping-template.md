# Approved data

## Stories covered
- [386. Add template file to upload page](https://github.com/icipe-official/vectoratlas-software-code/issues/386)
- [399. Add mapping templates for other data sources](https://github.com/icipe-official/vectoratlas-software-code/issues/399)
- [180. Add review page to UI](https://github.com/icipe-official/vectoratlas-software-code/issues/180)

## Demo
1. Check out `feature/mapping-templates-399` and run dev stack and API and UI
1. Navigate to the /upload page of the UI and show the template download section
1. Download one of the templates
1. Add a `Demo` folder to the `src/API/public/templates` folder
1. Add in the content from `Template mapping` to this new folder, explaining what's being added
1. Refresh the UI, and show the additional template options. Download the template file.
1. Select 'Demo' from the dropdown for data upload, and upload the `Demo data.csv` file.
1. Show the new row in the db
1. Use the email to navigate to the review page
1. Show the review page, and remove the id to show the message