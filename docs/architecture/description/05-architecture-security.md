# Security View

This section details the System architecture from the view-point of its security.

* **[Trust zones](#trust-zones)**
* **[Network security](#network-security)**
* **[Authentication and Authorization](#authentication-and-authorization)**
* **[Data security](#data-security)**
* **[Secret management](#secret-management)**
* **[Claims representation](#claims-representation)**
* **[Command security](#command-security)**
* **[Related sections](#related-sections)**

[Return to overview](./01-architecture-overview.md)

## Trust Zones

A Trust Zones view shows how system users move from being unknown and untrusted, to
establishing trust and permitting operations to be carried out by the system on their
behalf. It also highlights the protection needed by the system to prevent unauthorised
access to zones of high trust.

There are xx trust zones of interest to the System which are shown in the drawing below.
As calls proceed through the zones, the level of trust granted increases, from no-trust
at the top, to full-trust at the bottom.

To transition from one trust zone to the next, the call must pass through security checks
(usually shown below as left to right transitions within the zone) to become more trusted;
and then pass through a network restriction which tightens the protection of the services
running in the next trust zone.

![Trust zones](../drawings/trust-zones.png)

### Untrusted zone

_describe the nature of each zone, what operations are permitted in the zone, and how
to proceed to the next, more-trusted zone_

### Full trust zone

...

### Administration zones

The preceding discussion does not cover the administration of the System. The deployment,
monitoring and management of the System services will require various levels of
administration access. These are detailed in sections on Cloud security. Care needs to be
taken in the design of these to ensure separation between these and the **Full trust zone**
so that administrators cannot perform unauthorised actions on the system.

## Network security

### Cloud

#### Overview of Cloud design

_Describe design of cloud virtual networks_

#### DoS and IDS protection

_Describe protections against external attack_

#### Admin access to the system

_Describe how admins can securely access the cloud estate_

### Transport security

_Describe use and scope of TLS_

## Authentication and Authorization

_Describe how users are identified and authorised. May include interactions with enterprise
or other federated identity systems. Where do details of users live? How do services know
about the permitted roles of users?_

## Data security

_Wording assuming the system has some PII. This may be as little as email addresses - but
you should consider how to handle this compliantly_

The System needs to be compliant with Data Protection regulation, specifically **GDPR**.
Many aspects of that compliance are outside the scope of the architecture (eg consent) but
the System processes personal data on behalf of the Data Controller, and so needs to be
designed to do so in a way that demonstrably preserves the confidentially of personal data.

To this requires secure networks; robust authN/authZ (covered above) and secure handling
of sensitive data, which is covered below.

### Principles

_Example principles: you will need to tailor_

#### Encrypted drives

All parts of the system that handles sensitive data will use encrypted drives by default.
For cloud services, AWS S3 buckets will by used as the ultimate backing for persistent data,
giving low level encryption of all data at rest.

#### Minimal rights accounts

Connections used by services to access data stores should be granted the minimum set of
rights the allow them to perform their operation. This means that different services will
have their own credentials for data access, resulting in logical separation, even if the
data store is actually the same instance of a database service. This logical separation will
avoid accidental data leakage across boundaries, as well as making it easier to scale
different types of data differently.

#### Partitioning of data

System data will be partitioned to make it easier to secure the boundaries between data with
differing degrees of sensitivity. This is considered in more detail in the following section.

### Separation of sensitive data

We will separate sensitive data in the System to enable it to be handled confidentially:

#### User data

_Describe how user data will be managed: how stored; the impact of deletion; how user ids
are used in anonymous contexts_

#### Other sensitive data

_The system may also store personal data as part of its core functions: discussion may need
to cover logical models for splitting encrypted core and non-sensitive un-encrypted data;
how to find encrypted data; cloud storage regions; use of nonces in encryption etc_

#### Data from different Accounts

_If the system is multi-tenant describe how this is handled: tactics include
**Filter data by Account Id** and **Shard data by Account**_

#### Partitioning data within an Account

_Describe how you will manage access to subsets of resources_

### Auditing

_Describe how you will meet auditing requirements_

### Cloud data storage

_Details how data will be stored in Cloud services_

## Secret management

_Details how secrets will be managed in the system_

## Claims representation

_Discuss how claims will be passed around the System and verified (eg JWT, JWK) and 
specify details that are needed for services to collaborate correctly_

## Patching

_Discuss how patching of third-party components, libraries and frameworks will be handled and
who is responsible._

## Related sections

_Add links to other design work related to security of the System_
