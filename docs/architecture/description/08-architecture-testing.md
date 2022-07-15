# Testing View

This section details the System architecture from the view-point of its testing.

* **[Overall strategy](#overall-strategy)**
* **[Levels of testing](#levels-of-testing)**
* **[Test data](#test-data)**
* **[Test services](#test-services)**
* **[Related sections](#related-sections)**

[Return to overview](./01-architecture-overview.md)

_Much of the below is example content that might be suitable for some Cloud Native systems - rework to your needs_

## Overall strategy

_Define primary testing strategy._

Cloud Native systems are heavily dependent on automated testing to ensure services are
correct before deployment. We are designing for low coupling between services, which means
that, with appropriate stubbing, they can be run in isolation, and therefore are
particularly amenable to comprehensive automated testing. Additionally, we expect
individual services to be focussed in scope and therefore (relatively) simple.

_Other aspects may be relevent to your system_

These considerations lead to the following high level testing strategy:

## Levels of testing

_Describe levels of testing, both automated and manual, covering feature development and regression testing._

### Unit (code level)

Code level tests for smallest functional units individually and independently. All dependencies of the unit should be stubbed to isolate the behavior of the
unit under test. These tests should not have any runtime dependencies (e.g. on a database).

For small services this is less useful than in traditional software, given the presence of service-level tests (see below), so we do not require exhaustive unit
testing. However unit tests will be used to prove interesting business logic, especially where this is re-used by multiple services.

### Unit (service level)

The service are the real unit of interest in the system. Since all services must be
runnable in isolation (ie with all dependencies stubbed) they should have a comprehensive
set of automated tests which require and prove the service functions correctly according
to its public interfaces. This should include proving correct error responses in failure
cases.

Passing the above sets of automated tests will be a required gateway to deployment of the
system into TEST environment.

### Integration (service level)

After a automated deployment of a tip build we will run a suite of automated integration
tests to prove the deployment has succeeded, and that the deployed services are talking to
each other as expected. These tests are not expected to be exhaustive in scope, but should
allow us automatically confirm success of a deployment.

### End to end (business testing)

These automated tests will verify that the System meets the properties required by the
business. These tests will be potentially complex to write and so will target key system
use cases. Passing these tests will be a required gateway to deployment to PRODUCTION.

### Smoke tests (live testing)

These automated tests will run on the PRODUCTION system and will be used to monitor ongoing correctness, as well as (potentially) supporting evaluation of new
features though A/B testing.

## Test data

There are some important test data considerations:

### Todo

_Discuss the data sets that can be used, who will provide them, how data will be injected into the System etc.  How will you ensure test data is realistic
whilst also not requiring sensitive data to process._

## Test services

**Service integration** will often require functionality from a service that the API
does not provide. Sometimes this will be a short-term issue (e.g.
tests needing to create entities, when only read is currently is in scope) but others will
be longer-term needs for tests to perform operations which are not permitted on the real
system (e.g. deleting entities to ensure tests reset state on completion).

We will use the approach of creating Test services to handle this issue in a robust and
flexible manner:

![Test services](../drawings/test-services.png)

These Test services will never be deployed into production environments, and so allow us
to support robust automated testing while ensuring that we don't accidentally create System
backdoors.

Since the only purpose of these services is to provide test support, we can chose to
implement them in whatever manner is convenient, taking layer shortcuts and simplifying
assumptions as appropriate. However, we need to take care that we respect wider system
integrity when making test mutations.

## Performance testing

_Define strategy for testing performance/scalability of the system, including how you determine what constitutes realistic load._

## Security testing

_Define strategy for testing security of the platform (may link to the Security View).  What standards are you looking to meet?  Will you engage external
penetration testers?_

## Related sections

_Add links to other design work related to testing the System_
