# Architectural Design Document

## High-level architecture

The high-level architecture of the system is as follows:
 - A [Next.js](https://nextjs.org/) web application, which gets data from
 - A [Nest.js](https://nestjs.com/) API, with [GraphQL](https://graphql.org/) endpoints for data exploration, serving data from
 - A [PostgreSQL](https://www.postgresql.org/) database, with the [PostGIS](https://postgis.net/) extension for spatial data.