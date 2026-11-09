# Full occurrence data pipeline (API endpoint + OccurrenceGeoJob)

Date: 2026-11-09 · Code: `src/API/src/full-occurrence-data`, `src/OccurrenceGeoJob`,
`src/UI` map-v3, openapi/, Dockerfile/workflows

## What is served

`GET /vector-api/full-occurrence-data/{file_name}?ext={json|geojson}` serves
pre-generated payloads from `FULL_OCCURRENCE_DATA_FOLDER` (default
`src/API/tmp/occurrence_data`, mounted at `/occurrence_data` in k3s):

- `data.json` — all approved occurrences as a JSON array (vector panel etc.)
- `data.geojson` / `presence.geojson` / `absence.geojson` — GeoJSON
  FeatureCollections in EPSG:3857 with WebGL-ready properties, loaded directly
  into OpenLayers by map-v3 (no client-side feature building anymore)

Each file also exists as `.gz` / `.br`; `Accept-Encoding: br` is preferred over
`gzip`. ETag/Last-Modified caching (304), and byte ranges (206/416) on the
uncompressed file. Every GeoJSON FeatureCollection carries a `license` foreign
member: `CC BY-NC 4.0` (<https://creativecommons.org/licenses/by-nc/4.0/deed.en>),
matching the terms in the UI download dialog.

The payload includes normalized `species` info (`species_display_name`,
`species_category`, `species_color` — feature color prefers the species row's
color) and `country` info (`country_name`, `country_iso2`, `country_iso3`).

## When it regenerates (staleness)

`GET /full-occurrence-data/status` returns `{ stale, refreshing, hasPrevious }`
(no side effects). A request is stale when any output file or the
`generation-ledger.json` is missing, or when any of these changed since the last
generation:

- approved dataset set — sha256 of sorted approved dataset ids (catches
  approve/**disapprove/delete**, not just newer timestamps) plus the latest
  approval timestamp
- `max(modified)` of the `species` and `country` tables (display name / category
  / color edits)

## How it regenerates (await-stale-fallback, singleton)

- Not stale: serve as-is.
- Stale **with** a previous valid version: serve the stale file immediately with
  the `X-Occurrence-Data-Refresh: in-progress` header (the UI shows a toast) and
  spawn the OccurrenceGeoJob CLI in the background.
- Stale with **no** previous version (cold start): wait for the lock, re-check
  staleness (another replica may have just regenerated), then block until
  generation finishes.

Generation runs as an **awaited CLI child process** — the API spawns
`node $OCC_GEO_JOB_DIR/dist/index.js` (default `src/OccurrenceGeoJob`) with
`OCC_GEO_JOB_*`-prefixed env vars — never in-process, so the API event loop
stays responsive (an earlier in-process BullMQ version blocked all endpoints
during the big `JSON.stringify`/brotli passes). Singleton across **all** API
replicas (HA, shared PVC) via a Redis lock (`full-occurrence-data:generation-lock`,
`SET NX PX` 30 min, token-checked Lua release): a background refresh spawns
nothing when another replica holds the lock; `status()` reports `refreshing`
from the lock too. All Redis calls have a 3 s timeout guard so a Redis outage
cannot hang requests (generation triggering does depend on Redis, same as the
export/email queues). `ioredis` is pinned to `^5` because `typeorm@0.3.31`
peer-optionally requires `^5.0.4` (v6 breaks `npm ci` with ERESOLVE).
The job writes to a staging dir and atomically moves files into the target
folder (EXDEV copy fallback for cross-device moves), skipping files whose
checksum is unchanged, and writes the API-compatible `generation-ledger.json`.

`OCC_GEO_JOB_DIR` is API config (`src/API/src/config/config.ts`); the API
Dockerfile is built with context `src/` (`docker build -f src/API/Dockerfile src`)
and embeds the job at `/usr/src/OccurrenceGeoJob` (dist + sql + runtime deps).
GitHub Actions no longer build a standalone occurrencegeojob image; the api
image rebuilds when `src/API/**` **or** `src/OccurrenceGeoJob/**` changes.

## Related changes in the same commit

- `species` table + `SpeciesModule` (GraphQL `allSpecies`/`species`/`updateSpecies`,
  country analog already existed): `recorded_species.species` is now the FK to
  `species.id` (column name kept as `species`), ingest does lookup-or-create and
  validation rejects unknown species (`SPECIES_NOT_FOUND`).
- Admin `DELETE /dataset/:id` (admin role) + red Delete button in the admin
  datasets page: deletes the dataset's occurrence tree and only those
  site/sample/recorded_species/reference rows that no other dataset references
  ("do nothing" for shared rows); never touches `country`/`species`. Deleting or
  disapproving a dataset makes the occurrence payload stale (see above).
- openapi/: removed the old file-serving concept, documented
  `/full-occurrence-data/status` and `/{file_name}` (incl. the refresh hint
  header, content-encoding, ranges), regenerated `bundled.yaml`, README covers
  Scalar local serve (`document serve`) and public sandbox publish/update
  (`document share [--token]`).
