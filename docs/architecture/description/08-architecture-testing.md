# Testing View

This section details the System architecture from the view-point of its testing.

* **[Overall strategy](#overall-strategy)**
* **[Levels of testing](#levels-of-testing)**
* **[Test data](#test-data)**
* **[Performance testing](#performance-testing)**
* **[Security testing](#security-testing)**

[Return to overview](./01-architecture-overview.md)


## Overall strategy

_Define primary testing strategy._

Cloud Native systems are heavily dependent on automated testing to ensure services are correct before deployment. We are designing for low coupling between services, which means that, with appropriate stubbing, they can be run in isolation, and therefore are particularly amenable to comprehensive automated testing. Additionally, we expect individual services to be focussed in scope and therefore (relatively) simple.

These considerations lead to the following high level testing strategy:

## Levels of testing

_Describe levels of testing, both automated and manual, covering feature development and regression testing._

### Unit (code level)

Code level tests for smallest functional units individually and independently. All dependencies of the unit should be stubbed to isolate the behavior of the
unit under test. These tests should not have any runtime dependencies (e.g. on a database).


### Integration (code level)

Integration testing between modules, maybe with some local file access but not with databases can also be done in the code. There should be fewer of these and they are primarily aimed at ensuring units work together correctly.

Passing the above sets of automated tests will be a required gateway to deployment of the system into TEST environment.

### End to end (business testing)

These automated tests will verify that the System meets the properties required by the business. These tests will be potentially complex to write and so will target key system use cases. Passing these tests will be a required gateway to deployment to PRODUCTION.

There will also be manual system tests to cover the gaps until automated tests can be added, or in the event that an automated system test is not possible.

### Smoke tests (live testing)

These automated tests will run on the PRODUCTION system and will be used to monitor ongoing correctness, as well as (potentially) supporting evaluation of new
features though A/B testing.

## Test data

Since all of the data is public, there is no reason not to use the real production data (albeit possibly a smaller subset) in the test system as well.


## Performance testing

A strategy for performance testing needs to be defined given that we want the site to be responsive on a 1 Mbit/s connection - however, this is complex as we need to define what needs to be loaded in a quick enough time but still have a usable site. For example, we may be aiming for the map view to load in 20 seconds but this might mean a low resolution map with the data points and then subsequent more detailed tiles load over time - the site is still usable with the initial low resolution map.

## Security testing

The security profile of the site is low and focused around users uploading data - security API testing will focus on these areas to show that the upload and admin routes are secure.

The other area to focus security testing on is ensuring that user input for map filters doesn't allow SQL injection or script injection into the system.

