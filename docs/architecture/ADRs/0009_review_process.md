# Data Review Process

Date - 18/10/22

## Status
In progress

## Context
When new data is uploaded to the site, it needs to be reviewed by a member of the Vector Atlas team before it is made publicly available.

We need to formalise a process for the review of data uploaded to the site.

## Decision
The review process is shown in the image below:
![data review process](./images/review_process.png)

Additional comments from review:
 - The dataset will be read-only once approved
 - The templates will be available from the site before upload

## Consequences
New stories have been written covering technical implementation of this process.
We will be adding a new 'Dataset' table to the database, to hold the dataset-ids (linked to the parent entities) and the status of the dataset. The status can be one of three things:
 - Uploaded - This is for data that has been uploaded to the db, but not yet reviewed. It is not public data and should not be viewable on the map.
 - In review - This is for uploaded data which is being actively reviewed. It is not public data and should not be viewable on the map.
 - Approved - This is for data which has been reviewed and approved. It is public data, and is now read-only.