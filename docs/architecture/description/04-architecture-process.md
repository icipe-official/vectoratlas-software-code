# Process View

This section details the System architecture from the view-point of its dynamic processes.

* **[Processing pipelines](#processing-pipelines)**
* **[State models](#state-models)**
* **[Dynamic interactions](#dynamic-interactions)**
* **[Streaming components](#streaming-components)**
* **[Avoiding 2-Phase Commit](#avoiding-2-phase-commit)**
* **[Related sections](#related-sections)**

[Return to overview](./01-architecture-overview.md)

## Processing pipelines

_Many aspects of distributed systems can be viewed as pipelines: consider adding some for
your system here_

## State models

_Discuss significant state models_

## Dynamic interactions

_Discuss significant dynamic interactions between components or systems_


## Streaming components

_Discuss streaming components of the system_

## Data consistency strategies

_Discuss data read/write consistency and conflict resolution strategies, particularly when using distributed/sharded databases_

## Avoiding 2-Phase Commit
_This is an example that is common in distributed systems: remove if not relevant_

### Why 2-Phase Commit (2PC) is problematic

In distributed systems network partitioning can (and will) occur between any pair of systems.
Accordingly, operations that require mutations to more than one data store - or involve
more than one microservice which owns a distinct set of data - are problematic as the
operation has to be safe in the face of a network partition arising between the 2 systems
in the middle of an operation:

| Phase of distributed mutation | Consequence of network partition |
| ---- | ---- |
| Before 1st write is committed | **Safe** - whole operation returns failure; no state has changed |
| After 1st write is committed but before 2nd write is committed | **Danger!** - state is inconsistent, neither success or failure can be safely reported |
| After 2nd write is committed | **Safe** - whole operation returns success; state is consistent |

In order to handle this problem various forms of distributed transaction protocols have been developed, but they have severe impact on system performance due to the locks they apply and they do not scale well with increasingly distributed systems.

_State the impact of this on your system eg:_

>The xxx system is highly distributed - both in the AWS estate, and globally across plants -
so 2PC protocols are not possible, and we must avoid the situation where a 2-phase commit
is needed to ensure data integrity.

### General approach

Our general approach to avoiding the need for 2PC is

1. xxx

_Outline general approach and patterns - eg Single Writer; Collaborate by Event_

### Special considerations for XXX

_Discuss areas where care needs to be taken: specify patterns that should be used_

## Related sections

_Add links to other design work on dynamic parts of the System_
