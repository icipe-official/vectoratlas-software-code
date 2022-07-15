# Development View

This section details the System architecture from the view-point of its development.

* **[Technical Stack overview](#technical-stack-overview)**
* **[Language choices](#language-choices)**
* **[Technology choices](#technology-choices)**
* **[Design and Build Process](#design-and-build-process)**
* **[Development Tooling and Process](#development-tooling-and-process)**
* **[Related sections](#related-sections)**

[Return to overview](./01-architecture-overview.md)

## Technical Stack overview

The following diagram gives an overview of the Technologies being used by the System.

![tech stack](../drawings/tech-stack.png)

Subsequent sections go into greater detail.

## Language choices

_Detail languages used, and why_

## Technology choices

We have selected a number of technologies to help us build and host services effectively:

### System hosting

_Example hosting tech - yours should come from your ADRs_

| Name | Role | Reason for use |
| ---- | ----------- | -------------- |
| **AWS**  | Cloud hosting platform | We want to host our systems in the cloud to off-load all of the management issues associated with self hosting. We chose AWS as our cloud platform as we feel that it is the most robust of the options available and the team has previous AWS experience it can leverage. |
| **Terraform** | AWS infrastructure provisioning | We need to automate the building of our AWS estate, so that we can repeatably build and deploy environments. We will provision all AWS infrastructure using Terraform with state stored in S3. The state storage and plan features of Terraform will give us greater confidence that the changes we are applying are those that were expected. |
| **Ansible** | AWS software provisioning | Ansible is another scripted provisioning tool. Advice from an AWS expert indicates that Ansible is the better tool for provisioning the software components of our AWS estate. |
| **Docker** | Containerisation | We will use containerisation as it gives us light-weight, isolated components that can be run with confidence across different environments. Docker is the leading technology for containerisation.
| **Kubernetes** | Container orchestration | Kubernetes is the leading tool for managing the complexity of running a resilient set of containers. |
| **kops** | Kubernetes cluster management | Getting a production-grade Kubernetes cluster deployed into AWS is complicated; kops manages this crucial step for us. |
| **Helm** | Kubernetes manifests management | Deployment of resources to Kubernetes is performed through manifest files. Helm is the standard tool for managing these. |
| **Linkerd** | Service Mesh | Service meshes manage the concerns of inter-service communication in cloud native systems by having them communicate through a transparent proxy. We have decided to trial Linkerd as it is emerging as the leading Service Mesh technology at present.|
| **Bastion** | AWS server access | Bastion is the AWS component that controls connections from the public internet to our AWS server instances. This access is vital for administrating the estate, but needs careful set up to ensure access is only possible in a secure and authorised manner. |
| **Ingress** | AWS service access | Ingress is the ASW component that controls connections from the public internet to our application services. The access makes our Apps and APIs available for use, but the configuration needs to be correctly set to ensure only the permitted endpoints are available on the required domains. |
| **Quay** | Container repository | We are deploying all of our microservices as Docker containers. Given this we need a central Docker repository to allow us to publish and manage our containers. Quay is a SaaS container repository with enterprise management features. |
| **Concourse** | Continuous Integration server | We have decided that we use Concourse for our CI server as it sits in a sweet spot between old style CI servers which are configured through the user interface and light weight hosted CI which store their configuration in the repository. |
| **Vault** | Secret store | The System hosting is complex and needs to be fully automated so we can repeatably get it right. Concourse enables us to run this automation, and a number of other tools listed above support the provisioning process. However to securely provision an environment we need to be able to dynamically provision elements with the secrets they need to run. To do this securely requires a secure secret management tool; Vault is the leading tool in this space. |
| **Prometheus** | System monitoring and alerting | It is vital that we monitor our services and AWS estate so that performance can be actively tracked, and issues can be diagnosed. Prometheus is the leading open-source toolkit for systems monitoring and alerting. |

### System infrastructure

_Example infrastructure tech - yours should come from your ADRs_

| Name | Role | Reason for use |
| ---- | ----------- | -------------- |
| **Auth0** | Authentication | For shore-side systems, Auth0 gives us an easy way to consume federated identity services. By using a commercial service we save the development effort and risk of building a secure authentication framework. |
| **Postgres** | Relational data store | Some of the data in the System will best suit a relational data store. Postgres is a widely used database and is available as a service in AWS, meaning we can easily provision production-ready instances in the cloud. |
| **MongoDB** | Non-relational data store | Much of the data in the System will have patterns of use and structures which suit a non-relational data store. MongoDB is the leading database for storing data as unstructured or semi-structured JSON. |
| **Elasticsearch** | Search _and_ Timeseries data store | Elasticsearch is a mature database technology, and the leading tool for full-text and facetted search. The System will need this functionality, so we see Elasticsearch as a core technology for the System. Additionally it is a mature time-series datastore, making it the first-choice for the System for data that needs to be queried in relation to points, or periods of time. |
| **Kafka** | Event bus | The System is event-based to ensure synchronisation between distributed components, and responsive notification to interested parties. Kafka is the leading technology for high performance event processing, and will be a core enabler of achieving the System aims. |
| **Flink** | Stream processing | In an event-based system, most operations happen in response to streams of incoming events. Some of this processing will be handled by dedicated services, but we expect to build some functionality in a stream processing engine. Flink is emerging as the leading technology for low-latency, stateful stream processing. |
| **Fluentd** | Service logging collection | In a distributed system it is essential that distributed application logs are collected together for central monitoring and debugging. Fluentd is a leading tool for this and we intend to trial it in this role. |
| **Grafana** | Dashboarding | Grafana is a general purpose data exploration and visualisation tool for timeseries data. We expect to make use of Grafana for system monitoring dashboards. |

## Design and Build Process

The development of the System requires the involvement and co-ordination of many different
disciplines. The following diagram illustrates the organisation of the different phases
of Design and Build work required within an iterative development lifecycle. Of particular
note are the reviews needed, and artifacts produced to ensure smooth hand-off from each
phase to the next.

![design and build process](../drawings/process-design-and-build.png)

## Development Tooling and Process

Notes and guidance on our development tooling and processes are maintained in the
[System Maintenance Guide](../../technical-docs/smg.md).

## Related sections

_add links to other design work related to developing the System_
