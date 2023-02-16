# Umami Local Setup
​
Steps to add Umami to the site for local development:
1. Add the following lines to the `docker-compose.dev.yml` file, as another service:
```
  analytics:
    build:
      context: ./umami
      dockerfile: Dockerfile
      args:
        - BASE_PATH=/analytics
    ports:
      - '3003:3000'
    environment:
      BASE_PATH: /analytics
      DATABASE_URL: postgresql://postgres:postgrespass@db:5432/umami
      DATABASE_TYPE: postgresql
    depends_on:
      - db
    links:
      - db:db
    restart: always
    networks:
      - va-network
```
2. This is also a good time to check that `docker-compose.yml` is also correct:
```
   analytics:
    build:
      context: ./umami
      dockerfile: Dockerfile
      args:
        - BASE_PATH=/analytics
    environment:
      DATABASE_URL: $VA_DB_URL
      DATABASE_TYPE: postgresql
      BASE_PATH: /analytics
      CLIENT_IP_HEADER : "x-original-ip"
    restart: always
    ports:
      - '3003:3000'
    networks:
      - va-network
```
3. Run the above stack, and navigate to localhost:3003 in a browser. Log in with username `admin` and password `umami`.
4. Navigate to the Settings tab, and click `Add website`. Use `vector-atlas-test` as the Name, and `localhost:3002` as the Domain. Leave the rest as-is.
5. Click the `</>` button on the resulting row, and copy the `data-website-id` parameter.
6. In the env.local and env.production files, ensure this `data-website-id` is an environment variable under `NEXT_PUBLIC_ANALYTICS_ID`
7. You should see statistics start to appear on the Dashboard of the umami app at localhost:3003
