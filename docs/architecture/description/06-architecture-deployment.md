# Deployment View

This section details the System architecture from the view-point of its deployment.

* **[Overall approach](#overall-approach)**
* **[Container packaging design](#container-packaging-design)**
* **[Cloud deployment](#cloud-deployment)**
* **[Environment handling](#environment-handling)**
* **[Related sections](#related-sections)**

[Return to overview](./01-architecture-overview.md)

## Overall approach

_Describe the overall approach - eg Cloud hosted; Docker containers in Kubernetes, in AKS;
SaSS data stores; etc_

## Container packaging design

_If using containerisation, describe the approach to build and layers_

![Container packaging](../drawings/container-packaging.png)

## Cloud deployment

_Describe target cloud environment, chosen infrastructure resources, geographical concerns, deployment mechanism and
interfaces with external physical systems._

### Cost Analysis

_Infrastructure cost can be a key architectural constraint on a cloud-deployed project.  Analysis
of required scale of infrastructure and associated costs should be carried out early and confirmed
with your client.  Analysis should be repeated when component scale changes are required._

## Environment handling

We will build deployment artifacts once, and then promote them (subject to passing test
gates) through the environments to PRODUCTION.

This means all services must allow runtime configuration of all dependencies and settings.
These will be read from environment variables on load, and missing configuration will cause
the service to exit with an error and description of its required configuration.

Default values may not be used for any required settings since, whilst convenient, this
hides the dependency and may result in silent misconfiguration.

### Environment overview

_Detail the different environments_

## Related sections

_Add links to other design work related to deploying the System_