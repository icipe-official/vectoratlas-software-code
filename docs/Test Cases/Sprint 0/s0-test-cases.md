# Vector Atlas Sprint 0 Test Cases

## 1. Test Case Template

**Template for Test Cases**
> **TC[section number]** - **TESTCASE TITLE HERE**<br>
> **DATE:**<br>
> **TESTER:**<br>
> **PRE-CONDITION/ASSUMPTIONS:**
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
> **Comments:**

## 2. Test Cases (Functional Tests)

> **TC-1** - **Vector Atlas help site exists and displays screenshots**<br>
> **DATE:** 31/08/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>None
>
> | REF ID(s): | [10](https://github.com/icipe-official/vectoratlas-software-code/issues/10) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas home page http://localhost:1234/help/ | Vector Atlas home page appears | Pass |
> | 2 | Open a new tab on your browser | A new tab opens| Pass |
> | 2 | In the new tab, navigate to http://localhost:1234/help/ | Vector Atlas help site appears | Pass |
> | 3 | Click on "How to upload Vector Atlas data" link and check that an image is displayed | How to upload Vector Atlas data page appears and an image is displayed | Pass | 
>
> **Comments:** The help site is only reachable if you add a trailing slash to the URL (i.e. http://localhost:1234/help/). Omitting the slash (i.e. http://localhost:1234/help) returns a 404 error. [Bug 63](https://github.com/icipe-official/vectoratlas-software-code/issues/63) has been created to correct this.

***

> **TC-2** - **A UI and API version is displayed on the website<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>Tester is logged out of the website and has a Vector Atlas website account
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas home page (http://localhost:1234), scroll to the bottom of the page | UI and API Version are displayed | Pass |
> | 2 | Click on "Login", login into the website | User is logged in and taken to the Vector Atlas homepage | Pass |
> | 4 | Navigate to http://localhost:1234/, ensure you are still shown as logged in, scroll to the bottom of the page | UI and API Version are displayed | Pass |
> 
> **Comments:** Logging into the website redirects to port 3000, being logged in and manually navigating to port 1234 will display the UI and API versions correctly. This should only be an issue while using locally hosted environments.

***

> **TC-3** - **News section Feature flag exists and can be disabled<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for HOME_NEWS is set to true in src\API\public\feature_flags.json and tester is logged into the website
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas home page (http://localhost:1234) | Vector Atlas homepage appears | Pass |
> | 2 | Check that the News section is visible | News section is visible | Pass |
> | 3 | Set the feature flag for HOME_NEWS to false in src\API\public\feature_flags.json | Feature flag for HOME_NEWS is set to false | Pass |
> | 4 | Refresh the Vector Atlas webpage, News section is no longer visible. | After page refresh, the News section is no longer visible | Pass |
> 
> **Comments:**

***

> **TC-4** - **Stats section Feature flag exists and can be disabled<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for HOME_STATS is set to true in src\API\public\feature_flags.json and tester is logged into the website
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas home page (http://localhost:1234) | Vector Atlas homepage appears | Pass |
> | 2 | Check that the Stats section is visible | Stats section is visible | Pass |
> | 3 | Set the feature flag for HOME_STATS to false in src\API\public\feature_flags.json | Feature flag for HOME_STATS is set to false | Pass |
> | 4 | Refresh the Vector Atlas webpage, Stats section is no longer visible. | After page refresh, the Stats section is no longer visible | Pass |
> 
> **Comments:**

***

> **TC-5** - **Map section Feature flag exists and can be disabled<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for MAP is set to true in src\API\public\feature_flags.json and tester is logged into the website
>
> | REF ID(s): | [12](https://github.com/icipe-official/vectoratlas-software-code/issues/12) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas home page (http://localhost:1234) | Vector Atlas homepage appears | Pass |
> | 2 | Check that the Map section is visible | Map section is visible | Pass |
> | 3 | Set the feature flag for MAP to false in src\API\public\feature_flags.json | Feature flag for MAP is set to false | Pass |
> | 4 | Refresh the Vector Atlas webpage, Map section is no longer visible. | After page refresh, the Map section is no longer visible | Pass |
> 
> **Comments:**

***

> **TC-6** - **Home page text appears as expected**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>None
>
> | REF ID(s): | [55](https://github.com/icipe-official/vectoratlas-software-code/issues/55), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage http://localhost:1234/ | Vector Atlas homepage appears | Pass |
> | 2 | Check that the following text can be seen somewhere on the homepage:<br><br>Analyses-ready data and spatial models specifically tailored to inform malaria vector control<br><br>The Vector Atlas brings together a new collaboration of partners (icipe, University of Oxford, MAP, PAMCA, GBIF, VectorBase, IRMapper BMGF) in an initiative to build an online, open access repository to hold and share our analyses-ready malaria vector occurrence, bionomics, abundance, and insecticide resistance data. Our data will be fully up to date and form the basis of a series of spatial models specifically tailored to inform the control of mosquito vectors of disease. | The text can be seen somewhere on the homepage | Pass |
> 
> **Comments:**

***

> **TC-7** - **Vector Atlas homepage exists**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>None
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage http://localhost:1234/ | Vector Atlas homepage appears | Pass |
> 
> **Comments:** 

***

> **TC-8** - **Vector Atlas homepage has a navigation bar at the top of the page that contains the Vector Atlas logo**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>None
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage http://localhost:1234/ | Vector Atlas homepage appears | Pass |
> | 2 | Check that a navigation bar is visible at the top of the homepage and that the Vector Atlas logo is visible  | Navigation bar and logo are visible | Pass |
> 
> **Comments:** 

***

> **TC-9** - **The navigation bar contains a Map link**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21), [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage http://localhost:1234/ | Vector Atlas homepage appears | Pass |
> | 2 | Check that the navigation bar at the top of the homepage has a "Map" option  | Navigation bar is visible and has a link to a map page | Pass |
> 
> **Comments:** 

***

> **TC-10** - **The navigation bar Map link navigates to a page displaying an interactive map**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json
>
> | REF ID(s): | [21](https://github.com/icipe-official/vectoratlas-software-code/issues/21),[22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage http://localhost:1234/ | Vector Atlas homepage appears | Pass |
> | 2 | Check that the Map page can be navigated to by clicking Map in the navigation bar | A page appears with an interactive map visible  | Pass |
> 
> **Comments:** 

***

> **TC-11** - **Placeholder download buttons are visible on the Vector Atlas homepage**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json
>
> | REF ID(s): | [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas homepage http://localhost:1234/ | Vector Atlas homepage appears | Pass |
> | 2 | Check that placeholder "Download" buttons are visible | Placeholder "Download" buttons are visible | Pass |
> 
> **Comments:** None

***

> **TC-12** - **The background map image should load in under 20s**<br>
> **DATE:** 01/09/2022<br>
> **TESTER:** Colin Turner<br>
> **PRE-CONDITION/ASSUMPTIONS:**  <br><br>The feature flag for MAP needs to be set to true in src\API\public\feature_flags.json<br>TC-9 and TC-10 pass<br>The browser being used has been throttled to simulate a connection speed of 1MB/s (i.e. Dev tools in Chrome)
>
> | REF ID(s): | [22](https://github.com/icipe-official/vectoratlas-software-code/issues/22) | OVERALL RESULT: | Pass |
> | ------------ | --------- | --------- | ------|
> | **Step** | **Description** | **Expected Result** | **Result** |
> | 1 | Navigate to Vector Atlas interactive map page http://localhost:1234/map | Vector Atlas interactive map page appears | Pass |
> | 2 | The load time of the map page on a poor connection (1Mb/s) should be <20s | The target map page load time should be <20s | Pass - see comments |
> 
> **Comments:** Average map page load time on a simulated 1Mb/s connection: 7s to 8s