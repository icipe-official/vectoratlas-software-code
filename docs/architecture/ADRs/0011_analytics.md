# Site Analytics

Date - 29/11/22

## Status
Accepted

## Context
We need to add analytics to the website, to track user information and site usage.

## Decision
Google Analytics seems to be free to use, but there are issues around GDPR which need to be addressed - it is banned in Italy, Austria, France and Denmark. It looks like we'll need to add a provacy policy to the site, as well as having a cookie acceptance banner. The steps are covered here -. https://www.cookieyes.com/blog/google-analytics-gdpr/.

We have decided to use an analytics solution which is GDPR-compliant out of the box. umami.is is a good solution - we can host it ourselves and it doesn't process identifiable information.

## Consequences

We will add umami to the docker stack, and create a nginx redirect for `/statistics` to go to the endpoint of the umami server. New stories will be created to do this.

The umami server needs the "pgcrypto" extension enabled in postgres.

Steps to add Umami to the site for local development:
1. Add the following lines to the `docker-compose.dev.yml` file, as another service:
```
  analytics:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - '3003:3000'
    environment:
      DATABASE_URL: postgresql://postgres:postgrespass@db:5432/umami
      DATABASE_TYPE: postgresql
      HASH_SALT: 'replace-me-with-a-random-string'
    depends_on:
      - db
    links:
      - db:db
    restart: always
    networks:
      - va-network
```
2. Run the above stack, and navigate to localhost:3003 in a browser. Log in with username `admin` and password `umami`.
3. Navigate to the Settings tab, and click `Add website`. Use `vector-atlas-test` as the Name, and `localhost:3002` as the Domain. Leave the rest as-is.
4. Click the `</>` button on the resulting row, and copy the `data-website-id` parameter.
5. In the `_app.tsx` file in the UI project, add the following code to the return statement:
```
<Script async defer data-website-id="<copied_id>" src="http://localhost:3003/umami.js" />
```
where `<copied_id>` is the id copied in step 4, and `Script` is imported from 'next/script'. Run the UI
6. You should see statistics start to appear on the Dashboard of the umami app at localhost:3003

> It's important to note that Umami does not use an external service for country lookups from the IP - it uses an internal table lookup. The code is here https://github.com/umami-software/umami/blob/master/lib/request.js#L69 and discussed in this issue https://github.com/umami-software/umami/issues/461 . This is important to make sure it's compatible with GDPR.