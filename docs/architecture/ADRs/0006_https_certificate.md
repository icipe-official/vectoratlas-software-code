# HTTPS Certificate

Date - 15/08/22

## Status
In progress

## Context
The site needs to be deployed at a https address, this will likely need certificates of some sort and we should investigate options for getting certificates. Do we need to purchase a certificate or can we generate a free one?

## Decision
[Let's Encrypt](https://letsencrypt.org/) is a nonprofit Certificate Authority providing TLS certificates - we will be able to get a certificate from here. We could use [certbot](https://certbot.eff.org/) as the ACME client - see [this guide](https://certbot.eff.org/instructions?ws=nginx&os=ubuntubionic).

## Consequences
We will use Let's Encrypt to get the certificates needed for https.