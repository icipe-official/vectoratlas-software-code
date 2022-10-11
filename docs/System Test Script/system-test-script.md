# Vector Atlas System Test Script

## Contents
### 1. Introduction
### 2. System Test Script (Functional Testing)
### 3. Production Deployment Test Script (Functional Testing)
### 4. Non-Functional Test Script

---

## 1. Introduction
### 1.1 Purpose of this document

This document is the System Test Script for project 10942.

### 1.2 Scope of this document

This documents the test cases to test new functionality and, where available, existing dependent regression testing for the existing system. It also provides non-functional test cases where appropriate.

### 1.3 Context of this issue
This System Test Script has been produced during the project and any subsequent changes will be documented as the project progresses.

## 2. System Test Script (Functional Testing)

System testing is carried out as part of every sprint to ensure the completed stories and updated system meet all the applicable requirements. For full details on the system testing process, please consult the project test plan.

**Template for Test Cases**
> **TC-** - **TITLE**<br>
> **DATE:** Date<br>
> **TESTER:** Name<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [REF UNIQUE ID(s)](URL to ISSUE) | OVERALL RESULT: | Pass/Fail/Blocked |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 |  |  |  |
> | 2 |  |  |  |
> | 3 |  |  |  |
> | 4 |  |  |  |
> | 5 |  |  |  |
> 
> Comments: 

### Test data ###

**Vector Atlas homepage:** http://localhost:1234/<br>
**Vector Atlas help site:** http://localhost:1234/help/<br>
**Vector Atlas map page:** http://localhost:1234/map<br>
**Vector Atlas about page:** http://localhost:1234/about<br>
**Vector Atlas secure URL:** https://vectoratlas.icipe.org/<br>
**Case study text:** `docs\System Test Script\test-documents\case-study-text.md`<br>

***
> **TC-0.1** - **Vector Atlas help site exists and displays screenshots**<br>
> **DATE:** 08/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [10](https://github.com/icipe-official/vectoratlas-software-code/issues/10) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Open a new tab on your browser | A new tab opens| Pass |
> | 2 | In the new tab, navigate to Vector Atlas help site | Vector Atlas help site appears | Pass |
> | 3 | Click on "How to upload Vector Atlas data" link and check that an image is displayed | How to upload Vector Atlas data page appears and an image is displayed | Pass | 
>
> **Comments:** None

***

> **TC-0.2** - **A UI and API version is displayed on the website**<br>
> **DATE:** 08/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>Tester is logged out of the website and has a Vector Atlas website account
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage, scroll to the bottom of the page | UI and API Version are displayed | Pass |
> | 2 | Click on "Login", login into the website | User is logged in and taken to the Vector Atlas homepage | Pass |
> | 4 | Navigate to Vector Atlas homepage, ensure you are still shown as logged in, scroll to the bottom of the page | UI and API Version are displayed | Pass |
> 
> **Comments:** Logging into the website redirects to port 3000, being logged in and manually navigating to port 1234 will display the UI and API versions correctly. This should only be an issue while using locally hosted environments.

***

> **TC-0.3** - **News section Feature flag exists and can be disabled**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for HOME_NEWS is set to true in src\API\public\feature_flags.json and tester is logged into the website
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that the News section is visible | News section is visible | Pass |
> | 3 | Set the feature flag for HOME_NEWS to false in src\API\public\feature_flags.json | Feature flag for HOME_NEWS is set to false | Pass |
> | 4 | Refresh the Vector Atlas webpage, News section is no longer visible. | After page refresh, the News section is no longer visible | Pass |
> 
> **Comments:**

***

> **TC-0.4** - **Stats section Feature flag exists and can be disabled**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for HOME_STATS is set to true in src\API\public\feature_flags.json and tester is logged into the website
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that the Stats section is visible | Stats section is visible | Pass |
> | 3 | Set the feature flag for HOME_STATS to false in src\API\public\feature_flags.json | Feature flag for HOME_STATS is set to false | Pass |
> | 4 | Refresh the Vector Atlas webpage, Stats section is no longer visible. | After page refresh, the Stats section is no longer visible | Pass |
> 
> **Comments:**

***

> **TC-0.5** - **Map section Feature flag exists and can be disabled**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for MAP is set to true in src\API\public\feature_flags.json and tester is logged into the website
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that the Map section is visible | Map section is visible | Pass |
> | 3 | Set the feature flag for MAP to false in src\API\public\feature_flags.json | Feature flag for MAP is set to false | Pass |
> | 4 | Refresh the Vector Atlas homepage, Map section is no longer visible. | After page refresh, the Map section is no longer visible | Pass |
> 
> **Comments:**

***

> **TC-0.6** - **Homepage text appears as expected**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>None
>
> | REF ID(s): | [55](https://github.com/icipe-official/vectoratlas-software-code/issues/55), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that the following text can be seen somewhere on the homepage:<br><br>Analyses-ready data and spatial models specifically tailored to inform malaria vector control<br><br>The Vector Atlas brings together a new collaboration of partners (icipe, University of Oxford, MAP, PAMCA, GBIF, VectorBase, IRMapper BMGF) in an initiative to build an online, open access repository to hold and share our analyses-ready malaria vector occurrence, bionomics, abundance, and insecticide resistance data. Our data will be fully up to date and form the basis of a series of spatial models specifically tailored to inform the control of mosquito vectors of disease. | The text can be seen somewhere on the homepage | Pass |
> 
> **Comments:**

***

> **TC-0.7** - **Vector Atlas homepage exists**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>None
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> 
> **Comments:** 

***

> **TC-0.8** - **Vector Atlas homepage has a navigation bar at the top of the page that contains the Vector Atlas logo**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>None
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that a navigation bar is visible at the top of the homepage and that the Vector Atlas logo is visible  | Navigation bar and logo are visible | Pass |
> 
> **Comments:** 

***

> **TC-0.9** - **The navigation bar contains a Map link**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that the navigation bar at the top of the homepage has a "Map" option  | Navigation bar is visible and has a link to a map page | Pass |
> 
> **Comments:** 

***

> **TC-0.10** - **The navigation bar Map link navigates to a page displaying an interactive map**<br>
> **DATE:** 08/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21),[22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that the Map page can be navigated to by clicking Map in the navigation bar | A page appears with an interactive map visible  | Pass |
> 
> **Comments:** 

***

> **TC-0.11** - **Placeholder download buttons are visible on the Vector Atlas homepage**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json
>
> | REF ID(s): | [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage | Vector Atlas homepage appears | Pass |
> | 2 | Check that placeholder "Download" buttons are visible | Placeholder "Download" buttons are visible | Pass |
> 
> **Comments:** None

***

> **TC-0.12** - **The background map image should load in under 20s**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json<br>TC-9 and TC-10 pass<br>The browser being used has been throttled to simulate a connection speed of 1MB/s (i.e. Dev tools in Chrome)
>
> | REF ID(s): | [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas map page | Vector Atlas map page appears | Pass |
> | 2 | The load time of the map page on a poor connection (1Mb/s) should be <20s | The target map page load time should be <20s | Pass - see comments |
> 
> **Comments:** Average map page load time on a simulated 1Mb/s connection: 7s to 8s

***

> **TC-1.1** - **An About page exists and can be navigated to**<br>
> **DATE:** 20/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**
>
> | REF ID(s): | [32](https://github.com/icipe-official/vectoratlas-software-code/issues/32) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Naviagte to the Vector Atlas about page | About page appears | Pass |
> | 2 | Click on Home link in nav bar | Homepage appears | Pass |
> | 3 | Click on About link in nav bar | About page appears |  Pass |
> 
> **Comments:**

***

> **TC-1.2** - **The About page contains a description of the project**<br>
> **DATE:** 20/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**
>
> | REF ID(s): | [32](https://github.com/icipe-official/vectoratlas-software-code/issues/32) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Naviagte to the Vector Atlas about page | About page appears | Pass |
> | 2 | Check that an "About" section is visible | A section tiltled "About" is visible and contains a description of the project | Pass |
> 
> **Comments:**

***

> **TC-1.3** - **The About page contains contact details**<br>
> **DATE:** 20/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**
>
> | REF ID(s): | [32](https://github.com/icipe-official/vectoratlas-software-code/issues/32) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Naviagte to the Vector Atlas about page | About page appears | Pass |
> | 2 | Check that contact details are visible somewhere on the page | A section containing contact details is visible | Pass |
> 
> **Comments:**

***

> **TC-1.4** - **The About page contains team details**<br>
> **DATE:** 20/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**
>
> | REF ID(s): | [32](https://github.com/icipe-official/vectoratlas-software-code/issues/32) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Naviagte to the Vector Atlas about page | About page appears | Pass |
> | 2 | Check that details of team members are somewhere on the page | A section containing details of team members is visible | Pass |
> 
> **Comments:**

***

> **TC-1.5** - **The About page contains a list of partners and their logos**<br>
> **DATE:** 20/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**
>
> | REF ID(s): | [32](https://github.com/icipe-official/vectoratlas-software-code/issues/32) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Naviagte to the Vector Atlas about page | About page appears | Pass |
> | 2 | Check that a list of partners and their logos are somewhere on the page | A section listing partners and their logos is visible | Pass |
> 
> **Comments:**

***

> **TC-1.6** - **Rivers and lakes are only be visible on the map below zoom level 3**<br>
> **DATE:** 14/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**
>
> | REF ID(s): | [52](https://github.com/icipe-official/vectoratlas-software-code/issues/52) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to the Vector Atlas map page  | Map page appears, rivers and lakes are not visible | Pass |
> | 2 | Using the slider at the side of the page go to the bottom of the page and set the "Layer opacity" of the overlay to between 0.45 to 0.50 | Overlay opacity visibly decreases | Pass |
> | 3 | Click the zoom in button (+) once to increase the zoom level of the map | Map zoom increases, river and lakes are not visible  | Pass |
> | 4 | Click the zoom in button (+) once to increase the zoom level of the map | Map zoom increases, river and lakes are not visible  | Pass |
> | 5 | Click the zoom in button (+) once to increase the zoom level of the map | Map zoom increases, river and lakes are visible  | Pass |
> | 6 | Continue clicking the zoom in button (+) once to increase the zoom level of the map until maximum zoom is achieved | Map zoom increases, river and lakes remain visible  | Pass |
> | 7 | Press F5 to refresh the Vector Atlas map page  | Map page appears, zoom level is reset to default, rivers and lakes are no longer visible | Pass |
> | 8 | Using the slider at the side of the page go to the bottom of the page and set the "Layer opacity" of the overlay to between 0.45 to 0.50 | Overlay opacity visibly decreases | Pass |
> | 9 | Click the zoom out button (-) once to decrease the zoom level of the map | Map zoom decreases, river and lakes are not visible  | Pass |
> | 10 | Continue clicking the zoom out button (-) once to decrease the zoom level of the map until minimum zoom is achieved | Map zoom decreases, river and lakes are not visible  | Pass |
> 
> Comments: Default zoom level = 5

***

> **TC-1.7** - **Changes to the Map feature flag can be seen on the website without needing to rebuild the environment**<br>
> **DATE:** 21/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>Tester is logged into Vector Atlas website
>
> | REF ID(s): | [71](https://github.com/icipe-official/vectoratlas-software-code/issues/71) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Set the feature flag for Map to `true` in src\API\public\feature_flags.json | Feature flag for Map is set to `true` | Pass |
> | 2 | If the flag was changed to `true`,  stop the environment then restart it with `docker compose up` | Map feature flag is set to `true` |Pass |
> | 3 | Naviagte to the Vector Atlas homepage, check that the Map section is visible | Map section is visible on the homepage | Pass |
> | 4 | Set the Map feature flag to `false` | Map feature flag set to `false` | Pass |
> | 5 | Stop the environment, then restart it with `docker compose up`| Environment is restarted | Pass |
> | 6 | Refresh the homepage, check that the Map section is no longer visible | Map section is no longer visible on the homepage | Pass |
> 
> Comments: Setting the map feature flag to false disables the map link on the homepage and removes the interactive map from the map page. A map image is still visible on the homepage that links to the map page (the interactive map is not visible)

***

> **TC-1.8** - **Changes to the News feature flag can be seen on the website without needing to rebuild the environment**<br>
> **DATE:** 21/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>Tester is logged into Vector Atlas website
>
> | REF ID(s): | [71](https://github.com/icipe-official/vectoratlas-software-code/issues/71) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Set the feature flag for News to `true` in src\API\public\feature_flags.json | Feature flag for News is set to `true` | Pass |
> | 2 | If the flag was changed to `true`,  stop the environment then restart it with `docker compose up` | News feature flag is set to `true` |Pass |
> | 3 | Naviagte to the Vector Atlas homepage, check that the News section is visible | News section is visible on the homepage | Pass |
> | 4 | Set the News feature flag to `false` | News feature flag set to `false` | Pass |
> | 5 | Stop the environment, then restart it with `docker compose up`| Environment is restarted | Pass |
> | 6 | Refresh the homepage, check that the News section is no longer visible | News section is no longer visible on the homepage | Pass |
> 
> Comments: 

***

> **TC-1.9** - **Changes to the Stats feature flag can be seen on the website without needing to rebuild the environment**<br>
> **DATE:** 21/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>Tester is logged into Vector Atlas website
>
> | REF ID(s): | [71](https://github.com/icipe-official/vectoratlas-software-code/issues/71) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Set the feature flag for Stats to `true` in src\API\public\feature_flags.json | Feature flag for Stats is set to `true` | Pass |
> | 2 | If the flag was changed to `true`,  stop the environment then restart it with `docker compose up` | Stats feature flag is set to `true` | Pass |
> | 3 | Naviagte to the Vector Atlas homepage, check that the Stats section is visible | Stats section is visible on the homepage | Pass |
> | 4 | Set the Stats feature flag to `false` | Stats feature flag set to `false` | Pass |
> | 5 | Stop the environment, then restart it with `docker compose up`| Environment is restarted | Pass |
> | 6 | Refresh the homepage, check that the Stats section is no longer visible | Stats section is no longer visible on the homepage | Pass |
> 
> Comments:

***

> **TC-1.10** - **Changes to the map style can be seen on the website without needing to rebuild the environment**<br>
> **DATE:** 21/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>Tester is logged into Vector Atlas website
>
> | REF ID(s): | [71](https://github.com/icipe-official/vectoratlas-software-code/issues/71) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Ensure the map feature flag is set to `true` in src\API\public\feature_flags.json | Feature flag for Stats is set to `true` | Pass |
> | 2 | If the flag was changed to `true`,  stop the environment then restart it with `docker compose up` | Map feature flag is set to `true` |Pass |
> | 3 | Navigate to the Vector Atlas map page  | Map page and interactive map is visible | Pass |
> | 4 | Make the following changes to src\API\public\map_styles.json:<br><br>`oceans fillColor: [255,165,0,1]`<br><br>`countries fillColor:[238,130,238,0.25]`<br><br>`land fillColor: [255,0,0,0.5]`<br><br>`lakes_reservoirs fillColor: [0,0,0,1]`<br><br>`rivers_lakes strokeColor: [0,0,0,1]` | src\API\public\map_styles values are changed | Pass |
> | 5 | Stop the environment, then restart it with `docker compose up`| Environment is restarted | Pass |
> | 6 | Refresh the Map page | Map page appears, , the colours of the map have changed, oceans/seas are yellow, land is pink, rivers/lakes are dark red/black | Pass |
> 
> Comments:

***

> **TC-2.1** - **Interactive map has correct attribution**<br>
> **DATE:** 26/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [73](https://github.com/icipe-official/vectoratlas-software-code/issues/73) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Go to map page | Map page appears | Pass |
> | 2 | Click on attribution "i" icon to reveal attribution text | Check the text mentions "Natural Earth" | Pass |
> 
> Comments: 

***

> **TC-2.2** - **Interactive map zoom control styling**<br>
> **DATE:** 27/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [73](https://github.com/icipe-official/vectoratlas-software-code/issues/73) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Go to map page and check the zoom control styling is similar to Open Layer | Map page appears, check styling of zoom control is similar to [Open Layer](https://openlayers.org/en/latest/examples/attributions.html) | Pass |
> 
> Comments: 

***

> **TC-2.3** - **Bionomics and Occurrence entities are linked in db**<br>
> **DATE:** 04/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>This test should be carried out on a local testing branch<br>Instructions for loading data: `docs\SMG\10-working-with-database.md`<br>Database clear script: `src\Database\clear_tables.sql`<br>Test data: `src\Database\test_data`<br>
> | REF ID(s): | [76](https://github.com/icipe-official/vectoratlas-software-code/issues/76) | OVERALL RESULT: | Pass
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Clear the local db using the `clear_tables.sql` script | Database is cleared | Pass |
> | 2 | Upload Bionomics test data | One row of bionomics data exists in the db | Pass |
> | 3 | Upload Occurrence test data | Check that the two occurrence rows appear in the db, and that one row is linked to a bionomics ID | Pass  |
> 
> Comments: 

***

> **TC-3.1** - **Site is fully accessible via https**<br>
> **DATE:** 27/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [73](https://github.com/icipe-official/vectoratlas-software-code/issues/73) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Go to secure URL | VA website is reachable via secure URL | Pass |
> | 2 | Check all pages and internal links are working correctly | All pages and internal links are reachable with no errors | Pass |
> 
> Comments:

***

> **TC-3.2** - **Azure database is accessible via SSH tunnel**<br>
> **DATE:** 06/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>Tester has access to the .pem file
>
> | REF ID(s): | [136](https://github.com/icipe-official/vectoratlas-software-code/issues/136) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Follow the instructions in the `Connecting to Azure database` section contained in `docs\SMG\10-working-with-database.md` | Able to connect to database successfully | Pass |
> 
> Comments: 

***

> **TC-3.3** - **A `species` tables exists in the database**<br>
> **DATE:** 06/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [62](https://github.com/icipe-official/vectoratlas-software-code/issues/62) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Connect to the database | Connected to database | Pass |
> | 2 | Check that a `species` table exists | `species` table exists | Pass |
> | 3 | Check that a `recorded_species` table exists | `recorded_species` table exists | Pass |
>
> Comments: 

***

> **TC-3.4** - **The `species` table in the database is populated with species data**<br>
> **DATE:** 06/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [62](https://github.com/icipe-official/vectoratlas-software-code/issues/62) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Connect to the database | Connected to database | Pass |
> | 2 | Run the command: `SELECT * FROM species` | Species data is returned | Pass |
> 
> Comments: 

***

> **TC-3.5** - **A `user_role` table exists in the database**<br>
> **DATE:** 06/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>None
>
> | REF ID(s): | [68](https://github.com/icipe-official/vectoratlas-software-code/issues/68) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Connect to the database | Connected to database | Pass |
> | 2 | Check that a `user_role` table exists | `user_role` table exists | Pass |
> 
> Comments: 

***

> **TC-3.6** - **A protected API call will contain an authorisation token containing a user's role**<br>
> **DATE:** 07/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>Tester has a Vector Atlas account that has the "admin" role assigned to it<br>Test is run using the Chrome browser
>
> | REF ID(s): | [68](https://github.com/icipe-official/vectoratlas-software-code/issues/68) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to the Vector Atlas homepage and login | Logged into the Vector Atlas website | Pass |
> | 2 | Open Chrome developer tools - press F12 | Chrome developer tools opens | Pass |
> | 3 | Refresh the Vector Atlas webpage | Web page is refreshed | Pass |
> | 4 | Click the `Redux` tab in Chrome developer tools | Redux tab is displayed | Pass |
> | 5 | Ensure the Action is set to `Action`, under `filter...` find and click on `auth/getUserInfo/fulfilled` | Data is displayed in the `Action` window containing `type (pin):"auth/getUserInfo/fulfilled"` | Pass |
> | 6 | Expand the `payload` tree structure | `token` and `roles` can be seen.<br>`token` contains a token string<br>`roles` contains the `"admin"` role | Pass |
> 
> Comments: 

***

> **TC-3.7** - **An API call exists to return occurrence data**<br>
> **DATE:** 11/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>
>
> | REF ID(s): | [98](https://github.com/icipe-official/vectoratlas-software-code/issues/98) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Send the `POST` query: `query {allGeoData{site{longitude,latitude}}}` as a GraphQL query to the URL: `localhost:1234/vector-api/graphql` | The query returns data and a `200` status code. | Pass |
> 
> Comments: Insomnia was used to carry out this test but it should be possible to replicate the results with another API query tool such as Postman.

***

> **TC-3.8** - **Text on About page is left aligned**<br>
> **DATE:** 11/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>
>
> | REF ID(s): | [95](https://github.com/icipe-official/vectoratlas-software-code/issues/95) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to the Vector Atlas About page | Vector Atlas About page appears | Pass |
> | 2 | Check that the text on the page is left aligned | Alignment of the text on this page is left aligned | Pass |
> 
> Comments:

***

> **TC-3.9** - **Case Studies are present on the Vector Atlas Home page**<br>
> **DATE:** 11/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>
>
> | REF ID(s): | [95](https://github.com/icipe-official/vectoratlas-software-code/issues/95) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to the Vector Atlas Home page | Vector Atlas Home page appears | Pass |
> | 2 | Check that Case Studies appears on this page | `Case Study text` is visible on the page | Pass |
> 
> Comments: A link to `Case Study text` can be found under [Test Data](#test-data) at the top of this document

***

> **TC-3.10** - **API query returns a list of map overlays**<br>
> **DATE:** 11/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>
>
> | REF ID(s): | [74](https://github.com/icipe-official/vectoratlas-software-code/issues/74) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Send a `GET` query to the URL: `https://vectoratlas.icipe.org/vector-api/config/tile-server-overlays` | The query returns a list of overlays and a `200` status code. | Pass |
> 
> Comments: 

***

> **TC-3.11** - **Map page displays filters and overlays**<br>
> **DATE:** 11/10/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**<br>
>
> | REF ID(s): | [74](https://github.com/icipe-official/vectoratlas-software-code/issues/74) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to the Vector Atlas About page | Vector Atlas About page appears | Pass |
> | 2 | Expand the menu on the left of the page | A menu containing items labelled "Overlays" and "Base Map" appears | Pass |
> | 3 | Expand the "Overlays" and "Base Map" sections | Both sections contain options that can be selected (i.e. turned on or off) | Pass |
> 
> Comments: 

***

## 3. Production Deployment Test Script (Functional Testing)

## 4. Non-Functional Test Script