# Process View

This section details the System architecture from the view-point of its dynamic processes.

* **[Dynamic interactions](#dynamic-interactions)**
* **[Data consistency strategies](#data-consistency-strategies)**

[Return to overview](./01-architecture-overview.md)


## Dynamic interactions

_Discuss significant dynamic interactions between components or systems_

- Need to describe the upload process here
- Describe filtering and downloading data


## Data consistency strategies

_Discuss data read/write consistency and conflict resolution strategies, particularly when using distributed/sharded databases_

- Need to discuss the consistency problem of uploading data and then being able to download it when approved.
- Need to discuss building the zip of all data and then serving that as a file to improve caching.
