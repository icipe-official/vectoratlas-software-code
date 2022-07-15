# Architectural Description

## Contents

* **[Introduction](#introduction)**
* **[Architectural Background](#architectural-background)**
* **[System Context](./02-architecture-context.md)**
* **[View-Points & Views](#view-points--views)**
    * [Functional view](./03-architecture-functional.md)
    * [Process view](./04-architecture-process.md)
    * [Security view](./05-architecture-security.md)
    * [Deployment view](./06-architecture-deployment.md)
    * [Development view](./07-architecture-development.md)
    * [Testing view](./08-architecture-testing.md)
* **[Architecture Decision Records](../decisions)**
* **[References](./09-architecture-references.md)**

## Introduction

This document is intended to provide an Architectural Description of the Vector Atlas System.
This is a living record and will evolve as our understanding develops. As such, at any
given time there may be placeholder sections which indicate our expected direction of
travel (for the description and the System).

### High-level overview

The high-level architecture of the system is as follows:
 - A [Next.js](https://nextjs.org/) web application, which gets data from
 - A [Nest.js](https://nestjs.com/) API, with [GraphQL](https://graphql.org/) endpoints for data exploration, serving data from
 - A [PostgreSQL](https://www.postgresql.org/) database, with the [PostGIS](https://postgis.net/) extension for spatial data.

### Scope

This architectural description is intended to describe the System components and
services, how they communicate and what technologies are being used. It is targeted at a
technical audience with the intention of being both an introduction to the System and
also a long term developer reference about how the System should be structured,
developed and deployed.

This description is not intended to cover the details of specific implementations,
or software maintenance and does not provide information about how to deploy, maintain or
support a production instance.

#### Related documents

Documents and artefacts addressing lower-level details of the System architecture are
[referenced here](./09-architecture-references.md).

## Architectural Background

### Architectural Constraints

The following constraints have been placed on the system:

#### Constraint 1

State constraint and the architectural impact

#### Constraint 2

...

### System Qualities

_Examples listed: update for your system_

| Quality | Note |
|---------|------|
| **Reliability** | x |
| **Security** | x |
| **Scalability** | x |
| **Efficiency** | x |
| **Useability** | x |
| **Testability** | x |
| **Maintainability** | x |
| **Comprehensibility** | x |
| **Localisation** | x |
| **Extendability** | x |

### Engineering Principles

_Examples listed: update for your system_

| Principle | Rationale | Architectural impacts |
|-----------|-----------|-----------------------|
| **Separation of concerns** | x | x |
| **Horizontal scaling** | x | x |
| **Low coupling** | x | x |
| **Bounded contexts** | x | x |
| **Containerised services** | x | x |
| **Automation** | x | x |
| **Service visibility** | x | x |
| **12 Factors** | x | x |

### Architectural Styles

_Examples listed: update for your system_

| Style | Description |
|-------|-------------|
| **Microservice architecture** | x |
| **Event-based** | x |
| **Event Streaming** | x |
| **Event Collaboration** | x |
| **Broker topology** | x |
| **Multi-tenancy** | x |
| **Polyglot persistence** | x |
| **Federated authentication** | x |
| **Back-end for front-end** | x |

## System Context

The XXX system context is [covered here](./02-architecture-context.md)

## View Points & Views

In this architectural description the following
[View Points](https://www.iasaglobal.org/itabok/capability-descriptions/views-and-viewpoints/)
are chosen to describe the architecture:

* [Functional view](./03-architecture-functional.md)
* [Process view](./04-architecture-process.md)
* [Security view](./05-architecture-security.md)
* [Deployment view](./06-architecture-deployment.md)
* [Development view](./07-architecture-development.md)
* [Testing view](./08-architecture-testing.md)

## Architecture Decision Records

We are using ADRs to record decisions with architectural impacts. These can be viewed
[here](../decisions).
