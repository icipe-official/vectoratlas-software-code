# Unit testing API components

Date - 10/10/22

## Status
In progress

## Context
Nest.js makes heavy use of dependency injection, it is unclear how to write unit tests for each of the controllers, resolvers and services.

## Decision
We will create a central dependency injection module in a test helper, located in `src/API/src/testHelpers.ts` that provides a way of building mocked versions of the dependencies.

## Consequences
Unit tests in the API for resolvers, controllers and services should use the test helpers in their tests rather than creating a new testing module each time. Note that this does not exclude creating a new test module if trying to isolate specific functionality - for example the user role decorator requires a very different set up for a controller so uses it's own testing module.
