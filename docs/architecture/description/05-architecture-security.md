# Security View

This section details the System architecture from the view-point of its security.

* **[Trust zones](#trust-zones)**
* **[Network security](#network-security)**
* **[Authentication and Authorization](#authentication-and-authorization)**
* **[Data security](#data-security)**
* **[Secret management](#secret-management)**
* **[Claims representation](#claims-representation)**
* **[Pathching](#patching)**

[Return to overview](./01-architecture-overview.md)

## Trust Zones

A Trust Zones view shows how system users move from being unknown and untrusted, to establishing trust and permitting operations to be carried out by the system on their behalf. It also highlights the protection needed by the system to prevent unauthorised access to zones of high trust.

There are three zones within the Vector Atlas - most users do not need to log in and have access to all the public data, this is the untrusted zone. The second trust zone is for authenticated users to upload data, this gets stored in a holding area. The final and full trust zone is for reviewers who can cleanse and verify data being uploaded.

### Untrusted zone

Most users are unauthenticated and do not need to log into the system. All of the reviewed data is provided as open-access data. Similarly access to the map view, filtering and downloading are all open.

### Uploader trust zone

Users that want to upload data need to have an account and log into the system, they can then be given an uploader role to upload data to the system.

### Full trust zone

A reviewer or admin must have an account and log in but also have a reviewer role in order to promote data to the publicly viewable dataset.
...

### Administration zones

The preceding discussion does not cover the administration of the System. The deployment, monitoring and management of the System services will require various levels of administration access. These are detailed in sections on Cloud security. Care needs to be taken in the design of these to ensure separation between these and the **Full trust zone** so that administrators cannot perform unauthorised actions on the system.

## Network security

### Cloud

#### Overview of Cloud design

The system will be deployed to an individual server but inside a docker compose network, only the nginx port will be accessible from outside the server.

#### DoS and IDS protection

The system should apply DoS protections in the Nginx reverse proxy using some of the items listed here https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/

#### Admin access to the system

Admins will access the deployment server using ssh keys, it will be important to keep the private parts of these keys secure.

### Transport security

The system will use TLS certificates provided by Let's Encrypt using CertBot. TLS termination will occur at the proxy and communication inside the docker compose network will be insecure.

## Authentication and Authorization

The system will use Auth0 to manage the login process, and store user details. We will then exchange the Auth0 token for one we generate ourselves, and use this for communication between the UI and API. We will have a roles table in the database, containing the user's Auth0 id against any valid roles for that user. We will attach these roles to the token when it is created, and use these roles to determine what the authenticated user is authorised to do.

## Data security

The System needs to be compliant with Data Protection regulation, specifically **GDPR**. Many aspects of that compliance are outside the scope of the architecture (eg consent) but the System processes personal data on behalf of the Data Controller, and so needs to be designed to do so in a way that demonstrably preserves the confidentially of personal data.

To this requires secure networks; robust authN/authZ (covered above) and secure handling of sensitive data, which is covered below.

### Principles

#### Encrypted drives

All parts of the system that handle sensitive data will use encrypted drives by default. For cloud services, Azure blob storage will by used as the ultimate backing for persistent data, giving low level encryption of all data at rest.

#### Minimal rights accounts

Connections used by services to access data stores should be granted the minimum set of rights the allow them to perform their operation. This means that different services will have their own credentials for data access, resulting in logical separation, even if the data store is actually the same instance of a database service. This logical separation will avoid accidental data leakage across boundaries, as well as making it easier to scale
different types of data differently.

#### Partitioning of data

System data will be partitioned to make it easier to secure the boundaries between data with differing degrees of sensitivity. This is considered in more detail in the following section.

### Separation of sensitive data

We will separate sensitive data in the System to enable it to be handled confidentially:

#### User data

Sensitive user data will be handled through the Auth0 integration where there is a dedicated focus on storing user data securely - the Vector Atlas system will only store the users ID from the Auth0 system meaning that there should be no identifiable information within the Vector Atlas database.

Metrics will be collected for where users are connecting from but this will be aggregated across countries and only if the user has agreed to share their location. Individual users should not be identifiable from this data, it should only be to show the usage of the system.

Uploaders will be uploading knowing that this involves sharing their data and an attribution back to them by agreeing to terms and conditions. Similarly there may be identifiable information gathered from the published academic papers but through the process of the data subject publishing that original data (i.e. a citation to themselves) no additional processing consent is needed.

## Secret management

Secrets will be stored securely outside the system in an encrypted format. At deployment time the secrets should be loaded as environment variables so they are not stored natively on the deployment system and cannot be accessed by other users on the machine (although only admins should have access to the deployment vm).

## Claims representation

Once the Auth0 JWT token has been verified to authenticate a user, this will be exchanged for an authorisation token that contains the users roles - this can be verified internally without making excessive calls to the Auth0 API.

## Patching

The virtual machine will need regular security updates from the support team. The build will also use `npm audit` targets to identify vulnerabilities and this should be run on a regular basis even after the main development has finished to libraries can be patched.

