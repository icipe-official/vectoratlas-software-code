# Vector Atlas API Specification

This is the OpenAPI specification that defines the contract between the front-end and the back-end for the Vector Atlas Project.

Current OpenAPI specification in use: [3.1.0](https://spec.openapis.org/oas/v3.1.0.html)

**Documentation Status:** This README documents the Occurrence Service (search + full occurrence data) for the Vector Atlas Project.

## Table of Contents

- [Project Structure](#project-structure)
- [API Architecture Overview](#api-architecture-overview)
- [Occurrence Search Endpoint](#occurrence-search-endpoint)
- [Full Occurrence Data Endpoints](#full-occurrence-data-endpoints)
- [Development](#development)
  - [Validating the specification](#validating-the-specification)
  - [Generating a single bundled OpenAPI file](#generating-a-single-bundled-openapi-file)
  - [Previewing the specification locally](#previewing-the-specification-locally)
    - [Using Scalar (local server)](#using-scalar-local-server)
    - [Using swagger-ui](#using-swagger-ui)
    - [Using ReDoc](#using-redoc)
  - [Publishing to the Scalar sandbox](#publishing-to-the-scalar-sandbox)

## Project Structure

The OpenAPI specification is organized into separate files for maintainability:

```
openapi/
├── openapi.yaml              # Main OpenAPI specification file
├── bundled.yaml             # Bundled single-file version
├── README.md               # This documentation
├── paths/
│   └── occurrence/          # Occurrence endpoint definitions
│       ├── search.yaml                     # GET /search/{entityType} - Search occurrence records
│       └── full_occurrence_data.yaml       # GET /full-occurrence-data/... - Generated payload files
├── schemas/
│   ├── common/              # Common schemas
│   │   ├── error.yaml          # Error response schema
│   │   └── pagination.yaml     # Pagination schema
│   └── occurrence/          # Occurrence schemas
│       ├── occurrence.yaml                 # Occurrence entity schema
│       ├── occurrence_search_result.yaml   # Search result wrapper schema
│       └── full_occurrence_data_status.yaml # Full occurrence data status schema
├── responses/
│   ├── common/              # Common responses
│   │   └── error.yaml          # Error responses
│   └── occurrence/          # Occurrence responses
│       ├── occurrence_search_result.yaml   # Search result response
│       └── full_occurrence_data.yaml       # Full occurrence data responses
└── parameters/
    ├── common/              # Common parameters
    │   └── pagination.yaml     # Pagination parameters
    └── occurrence/          # Occurrence parameters
        ├── search_parameters.yaml              # Search query parameters
        └── full_occurrence_data_parameters.yaml # Full occurrence data parameters
```

## API Architecture Overview

The Vector Atlas API exposes two public groups of endpoints:

- **Occurrence search**: query and filter occurrence records with pagination and field projection.
- **Full occurrence data**: pre-generated occurrence payloads (JSON + GeoJSON) that back the map, served from disk with HTTP caching and compression.

## Occurrence Search Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search/{entityType}` | Search occurrence records (`entityType=occurrence`) with filters, pagination (`take`/`skip`), timeline ranges, and field projection (`fields`). A single record can be fetched with `?id=<id>`. |

## Full Occurrence Data Endpoints

The API pre-generates the full occurrence dataset on demand and caches it on disk
(`FULL_OCCURRENCE_DATA_FOLDER`). The payload is regenerated when the set of approved
datasets changes (add / disapprove / delete), when the latest approval timestamp moves,
or when the `species` / `country` tables are edited. Generation is a singleton job.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/full-occurrence-data/status` | Generation status: `{ stale, refreshing, hasPrevious }`. No side effects. |
| GET | `/full-occurrence-data/{file_name}?ext=<ext>` | Serve a generated file. `file_name` is `data`, `presence`, or `absence`; `ext` is `json` or `geojson`. |

**Available files:**

- `data.json` — full occurrence records as a JSON array (non-map panels)
- `data.geojson` — all occurrences as a GeoJSON FeatureCollection (EPSG:3857)
- `presence.geojson` — presence-only FeatureCollection (loaded directly into the map)
- `absence.geojson` — absence-only FeatureCollection (loaded directly into the map)

Each GeoJSON FeatureCollection carries a `license` foreign member
(`CC BY-NC 4.0`, <https://creativecommons.org/licenses/by-nc/4.0/deed.en>), matching the
terms users accept in the UI download dialog. Each file also exists as `.gz` and `.br`.

**Refresh semantics:**

- Stale files with a previous valid version are served immediately, with the
  `X-Occurrence-Data-Refresh: in-progress` response header while regeneration runs in
  the background (clients can surface a "data is being refreshed" notice).
- On a cold start (no previous version) the request blocks until generation completes.

**HTTP behaviour:** `ETag` / `Last-Modified` caching with `304 Not Modified`,
`Accept-Encoding` negotiation (`br` preferred over `gzip`), and byte-range support
(`Accept-Ranges: bytes`, `206 Partial Content`, `416` when unsatisfiable; ranges apply
to the uncompressed file only).

## Development

### Validating the specification

Validate the current specification:

```bash
# Quick validation
npx @apidevtools/swagger-cli validate openapi.yaml

# Detailed validation with suggestions
npx @redocly/cli openapi lint openapi.yaml
```

### Generating a single bundled OpenAPI file

This setup separates the OpenAPI spec into separate files.

For tools that don't auto-bundle, we create a single bundled file:

```bash
$PATH_TO_BUNDLED_OPENAPI_FILE=bundled.yaml

npx @apidevtools/swagger-cli bundle openapi.yaml -o $PATH_TO_BUNDLED_OPENAPI_FILE
```

The resulting file, [bundled.yaml](./bundled.yaml), can then be previewed by any tool including web based tools like [swagger-editor](https://editor.swagger.io/).

### Previewing the specification locally

> NB. Ensure the bundled spec file has been generated. See [here](#generating-a-single-bundled-openapi-file) on how to do so.

If you want auto-reloading, run the following in one terminal:

```bash
npx @apidevtools/swagger-cli bundle openapi.yaml -o bundled.yaml --watch
```

#### Using Scalar (local server)

[Scalar](https://scalar.com) renders the API reference from the bundled file and starts a local server (default port 5051):

```bash
# serve bundled.yaml locally and open the browser
npx @scalar/cli document serve bundled.yaml

# custom port, and auto-reload on changes
npx @scalar/cli document serve bundled.yaml --port 5051 --watch
```

To preview the modular `openapi.yaml` directly (Scalar resolves the `$ref`s itself), point it at the root file instead — but prefer `bundled.yaml` so what you preview matches what gets published:

```bash
npx @scalar/cli document serve openapi.yaml --watch
```

#### Using swagger-ui

```bash
$PATH_TO_BUNDLED_OPENAPI_FILE=bundled.yaml

npx openapicmd swagger-ui $PATH_TO_BUNDLED_OPENAPI_FILE
```

#### Using ReDoc

```bash
$PATH_TO_BUNDLED_OPENAPI_FILE=bundled.yaml

npx openapicmd redoc $PATH_TO_BUNDLED_OPENAPI_FILE
```

This will start a local server and open your browser to preview the API documentation.

### Publishing to the Scalar sandbox

Publish the bundled spec to a public Scalar sandbox (requires a Scalar account login on first run; use `--no-input` in CI):

```bash
npx @scalar/cli document share bundled.yaml
```

The command prints the public links, e.g.:

```
➜ API Reference: <https://sandbox.scalar.com/p/-duHK>
➜ Editor:        <https://sandbox.scalar.com/e/-duHK>
➜ OpenAPI JSON:  <https://sandbox.scalar.com/files/-duHK/openapi.json>
➜ OpenAPI YAML:  <https://sandbox.scalar.com/files/-duHK/openapi.yaml>
```

Keep the token it prints — it is needed to update the same sandbox later instead of creating a new one:

```bash
npx @scalar/cli document share bundled.yaml --token=<token>
```

See [scalar.md](./scalar.md) for a captured example of a `share` run and its update token.
