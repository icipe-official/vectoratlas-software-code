# Data Review Process

Date - 1/11/22

## Status
In progress

## Context
We need to ability to send emails when someone asks to sign up to the system. It's currently unclear if there is a service we can use for this (e.g. in Azure) or do we need to deploy our own SMTP server. The investigation should work out how we can send emails from the system - we can then integrate this with the new user process as well as the review process.

There is no obvious solution for this in Azure - they do not offer an email service.

We could use [Nodemailer](https://nodemailer.com/about/) with an existing email account. This would require the credentials of that account to be used and stored securely.

## Decision

## Consequences
