# OccurrenceGeoJob

> **Pre-processes occurrence data from PostgreSQL into WebGL-ready GeoJSON for fast client-side loading.**

OccurrenceGeoJob is a data preprocessing pipeline designed for the [Vector Atlas](https://vectoratlas.org/) project. It extracts vector occurrence data from a PostgreSQL database and transforms it into optimized data formats that enable fast, efficient rendering in web-based mapping applications.

## Overview

The job performs the following key operations:

1. **Streams occurrence data** from PostgreSQL in configurable batch sizes using `pg-cursor` for memory-efficient processing of large datasets
2. **Pre-processes data** by:
   - Reprojecting coordinates to EPSG:3857 (Web Mercator) for WebGL compatibility
   - Pre-computing species colors as normalized RGB/RGBA values
   - Determining presence/absence status
   - Extracting all filter-relevant attributes
   - Setting WebGL shader attributes in advance
3. **Uses atomic file generation** to ensure data consistency:
   - Files are first generated in a staging directory
   - All files are validated and tracked in a ledger
   - Files are atomically moved to the target directory once generation is complete
   - Supports resumption of interrupted jobs
4. **Generates four output files:**
   - Raw occurrence data JSON (for GraphQL API serving)
   - Combined WebGL-ready GeoJSON (all occurrences)
   - Presence-only GeoJSON layer
   - Absence-only GeoJSON layer
5. **Compresses all outputs** using gzip and Brotli formats for optimal web delivery

The processed files are designed for fast client-side loading, enabling smooth visualization of vector occurrence data in web applications without server-side processing overhead.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         OccurrenceGeoJob                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────────┐  │
│  │ PostgreSQL  │───▶│ Stream        │───▶│ Preprocessing       │  │
│  │ (pg-cursor) │    │ Batches       │    │ Module              │  │
│  └─────────────┘    └──────────────┘    └────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Output Generation                         │  │
│  ├──────────────────┬─────────────────────┬────────────────────┤  │
│  │ Raw Data JSON     │ Combined GeoJSON    │ Presence/Absence   │  │
│  │ (GraphQL serving) │ (WebGL-ready)       │ Layers             │  │
│  └──────────────────┴─────────────────────┴────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Atomic Operations                        │  │
│  │  ┌─────────────────┐    ┌─────────────────┐               │  │
│  │  │ Staging Dir     │───▶│ Target Dir     │               │  │
│  │  │ (temporary)     │    │ (final files)  │               │  │
│  │  └─────────────────┘    └─────────────────┘               │  │
│  │                    Ledger Tracking                           │  │
│  │  Track progress, support resumption, ensure atomicity      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Compression                              │  │
│  │  gzip (.gz) and Brotli (.br) for all output files           │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
OccurrenceGeoJob/
├── src/
│   ├── index.ts                    # Main entry point and orchestrator
│   │
│   ├── db/
│   │   ├── index.ts                # Database module exports
│   │   ├── cursor.ts               # pg-cursor streaming utilities
│   │   ├── queries.ts              # SQL query loader
│   │   └── occurrenceFetcher.ts    # Occurrence data streaming
│   │
│   ├── preprocess/
│   │   ├── index.ts                # Preprocessing module exports
│   │   ├── colors.ts               # Color utilities and species coloring
│   │   ├── coordinates.ts          # Coordinate reprojection (EPSG:4326 → EPSG:3857)
│   │   ├── geojsonBuilder.ts       # GeoJSON FeatureCollection builder
│   │   ├── occurrenceBuilder.ts    # Occurrence data processor
│   │   └── splitLayers.ts          # Presence/absence layer splitter
│   │
│   ├── compress/
│   │   └── index.ts                # File compression (gzip, Brotli)
│   │
│   ├── config/
│   │   ├── index.ts                # Configuration module exports
│   │   ├── paths.ts               # File paths configuration
│   │   ├── ledger.ts              # Status/ledger tracking for atomic operations
│   │   └── atomic.ts              # Atomic file replacement utilities
│   │
│   ├── types/
│   │   ├── index.ts                # Type exports
│   │   ├── occurrence_data.ts      # Occurrence data interfaces
│   │   └── species_color_map.ts    # Species color mapping types
│   │
│   └── utils/
│       ├── index.ts                # Utilities exports
│       ├── booleanParser.ts        # String-to-boolean parsing
│       ├── db.ts                   # Database connection utilities
│       └── logger.ts               # Winston-based logging
│
├── sql/
│   └── occurrence_data.sql         # SQL query for fetching occurrence data
│
├── justfile                        # Project commands (just utility)
├── justw                          # Just wrapper script (auto-downloads just binary)
├── entrypoint.sh                  # Container entrypoint
├── Dockerfile                     # Multi-stage container build
├── package.json                   # Node.js dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── .envrc.template                 # Environment variables template
```

## Prerequisites

- Node.js 20+ (recommended: 20.19.0)
- PostgreSQL database with the Vector Atlas schema
- npm or yarn

## Development

This project uses [just](https://just.systems/) as a command runner. The just binary is automatically downloaded via the `justw` wrapper script.

### Getting Started

1. **Make the wrapper script executable:**

   ```bash
   chmod +x ./justw
   ```

2. **List available commands:**

   ```bash
   ./justw --list
   ```

3. **Show usage for a specific command:**

   ```bash
   ./justw --usage <RECIPE_NAME>
   # Example:
   ./justw --usage container-build
   ```

4. **Install dependencies:**

   ```bash
   ./justw npm-install    # Uses npm install
   # or
   ./justw npm-ci        # Uses npm ci (clean install from lock file)
   ```

### Building

The build process compiles TypeScript and resolves path aliases (e.g., `@/config`) to actual relative paths in the `dist/` directory using `tsc-alias`. This ensures runtime compatibility with Node.js ESM modules.

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `just build`     | Clean build (removes dist/, rebuilds) |
| `just npm-build` | TypeScript compilation only           |
| `just clean`     | Removes dist/ directory               |

### Running

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `just dev`        | Full dev cycle: build, log env vars, start job |
| `just node-start` | Execute the job (requires env vars)            |
| `just log-env`    | Display all configured environment variables   |

### Code Quality

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `just format`       | Format code with Prettier and fix lint issues |
| `just npm-format`   | Format code with Prettier only                |
| `just npm-lint-fix` | Fix lint issues only                          |

### Testing

The project uses [Vitest](https://vitest.dev/) for testing. Tests use path aliases configured in `tsconfig.json`.

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `just test`             | Run all tests once                  |
| `just test-watch`       | Run tests in watch mode             |
| `just test-coverage`    | Run tests with coverage report      |
| `npm test`              | Run all tests (same as `just test`) |
| `npm run test:watch`    | Run tests in watch mode             |
| `npm run test:coverage` | Run tests with coverage report      |

**Note:** Environment variables from `.envrc` are automatically loaded. To run tests with a clean environment, unset variables before running:

```bash
# Run tests
./justw test

# Or with npm
source .envrc && npm test
```

### Container Commands

All container commands support both `docker` and `podman` as the container runtime (default: `docker`).

| Command                         | Description                      |
| ------------------------------- | -------------------------------- |
| `just container-build`          | Build container image            |
| `just container-push`           | Push container image to registry |
| `just container-build-and-push` | Build and push container image   |

## Environment Variables

### PostgreSQL Connection

The job connects to PostgreSQL using standard connection environment variables:

| Variable     | Required | Default     | Description         |
| ------------ | -------- | ----------- | ------------------- |
| `PGPORT`     | Yes      | `5432`      | PostgreSQL port     |
| `PGUSER`     | Yes      | -           | PostgreSQL username |
| `PGPASSWORD` | Yes      | -           | PostgreSQL password |
| `PDATABASE`  | Yes      | -           | Database name       |
| `PGHOST`     | Yes      | `127.0.0.1` | PostgreSQL host     |

### Atomic Operations Configuration

The job uses atomic file generation with staging directories and ledger tracking for resumption:

| Variable            | Required | Default          | Description                                                                    |
| ------------------- | -------- | ---------------- | ------------------------------------------------------------------------------ |
| `TARGET_DIRECTORY`  | No       | `./.tmp/target`  | Directory for final output files                                               |
| `STAGING_DIRECTORY` | No       | `./.tmp/staging` | Temporary directory for file generation                                        |
| `FILE_PATHS_CONFIG` | No       | -                | Optional path to JSON configuration file (environment variables override this) |
| `CREATE_BACKUP`     | No       | `false`          | Set to `true` to create backups before file replacement                        |

> **Note:** Environment variables (`TARGET_DIRECTORY`, `STAGING_DIRECTORY`) take precedence over `FILE_PATHS_CONFIG`. If a configuration file is used, it should contain a JSON object with `targetDirectory`, `stagingDirectory`, and `files` properties.

> **Note:** Files are compared using SHA-256 checksums. If a target file already exists with a matching checksum, it will be skipped to avoid unnecessary I/O operations.

> **Note:** All output files are automatically compressed to `.gz` (gzip) and `.br` (Brotli) formats. Compressed files are always replaced when the source file changes.

### SQL Queries

| Variable             | Required | Default                      | Description                                                                                 |
| -------------------- | -------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `SQL_QUERIES_FOLDER` | No       | Depends on execution context | Path to directory containing SQL query files. In container, defaults to `/home/app/app/sql` |

### Logging Configuration

| Variable        | Required | Default   | Description                                                                 |
| --------------- | -------- | --------- | --------------------------------------------------------------------------- |
| `LOGGER_LEVEL`  | No       | `info`    | Logging level: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly` |
| `LOGGER_OUTPUT` | No       | `console` | Output format: `console` (human-readable) or `json` (structured)            |

### Container Configuration

Container commands accept the following parameters (with defaults shown):

| Parameter      | Long Form              | Short Form | Default              | Description                              |
| -------------- | ---------------------- | ---------- | -------------------- | ---------------------------------------- |
| CLI tool       | `--container-cli-tool` | `-c`       | `docker`             | Container runtime (`docker` or `podman`) |
| Image name     | `--image-name`         | `-n`       | `occurrence-geo-job` | Name for the container image             |
| Image tag      | `--image-tag`          | `-t`       | `latest`             | Tag for the container image              |
| Container file | `--container-file`     | `-f`       | `Dockerfile`         | Path to the container build file         |
| Build context  | `--build-context`      | `-b`       | `.`                  | Build context path                       |

### Performance Configuration

| Variable     | Required | Default | Description                                                                                                                                                    |
| ------------ | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BATCH_SIZE` | No       | `1000`  | Number of records to fetch per batch. Lower values reduce memory usage but may slow down processing. Higher values improve throughput but require more memory. |

### Example Environment Setup

Using the provided template:

```bash
# Copy template to .envrc
cp .envrc.template .envrc

# Source the environment (or use direnv)
source .envrc
```

Or set variables directly:

```bash
# PostgreSQL
PGPORT=5432 \
PGUSER=postgres \
PGPASSWORD=mysecretpassword \
PDATABASE=mva \
PGHOST=localhost

# Atomic Operations Configuration
TARGET_DIRECTORY=./output/target \
STAGING_DIRECTORY=./output/staging \
FILE_PATHS_CONFIG=./file-paths.config.json \
CREATE_BACKUP=false

# Logging
LOGGER_LEVEL=debug
LOGGER_OUTPUT=console

# Performance
BATCH_SIZE=500
```

## Use Cases

### Local Development

Process data from a local PostgreSQL database:

```bash
# Set up environment
cp .envrc.template .envrc
# Edit .envrc with your database credentials
source .envrc

# Install dependencies and run
./justw setup
./justw node-start
```

### Container Deployment

Build and run in a containerized environment:

```bash
# Build the image with defaults (docker, occurrence-geo-job:latest, Dockerfile, .)
./justw container-build

# Build with custom parameters
./justw container-build --container-cli-tool podman --image-name my-image --image-tag v1.0

# Or use short forms
./justw container-build -c podman -n my-image -t v1.0

# Run the built image with environment variables
docker run --rm -it \
  -e PGPORT=5432 \
  -e PGUSER=postgres \
  -e PGPASSWORD=secret \
  -e PDATABASE=mva \
  -e PGHOST=host.docker.internal \
  -e TARGET_DIRECTORY=/output/target \
  -e STAGING_DIRECTORY=/output/staging \
  -e FILE_PATHS_CONFIG=/config/file-paths.config.json \
  -e CREATE_BACKUP=false \
  -v $(pwd)/output:/output \
  -v $(pwd)/config:/config \
  occurrence-geo-job:latest
```

### CI/CD Pipeline

Integrate into a deployment pipeline:

```bash
# Build, test, and push
./justw setup
./justw format
./justw container-build-and-push --container-cli-tool docker --image-name myregistry/occurrence-geo-job --image-tag $(git rev-parse --short HEAD)
```

### Production Deployment

Run as a scheduled job (e.g., cron, Kubernetes CronJob):

```bash
# Using just to run directly
direnv exec . ./justw node-start

# Or via container with a mounted volume for outputs
docker run --rm \
  -e PGPORT=5432 \
  -e PGUSER=${DB_USER} \
  -e PGPASSWORD=${DB_PASSWORD} \
  -e PDATABASE=${DB_NAME} \
  -e PGHOST=${DB_HOST} \
  -e TARGET_DIRECTORY=/output/target \
  -e STAGING_DIRECTORY=/output/staging \
  -e FILE_PATHS_CONFIG=/config/file-paths.config.json \
  -e SQL_QUERIES_FOLDER=/home/app/app/sql \
  -v ${OUTPUT_DIR:-./output}:/output \
  -v ${CONFIG_DIR:-./config}:/config \
  occurrence-geo-job:latest
```

## SQL Query

The job uses a single SQL query (`sql/occurrence_data.sql`) to fetch occurrence data from PostgreSQL. The query:

- Joins the `occurrence`, `dataset`, `site`, `recorded_species`, and `sample` tables
- Filters for datasets with `status = 'Approved'`
- Extracts:
  - Occurrence metadata (ID, species, presence, abundance, bionomics, resistance data)
  - Temporal data (year, season)
  - Spatial data (country, location as GeoJSON Point)
  - Sample data (control status)
- Returns coordinates as GeoJSON Point objects with EPSG:4326 (WGS84) coordinates

To modify the data being processed, edit `sql/occurrence_data.sql`.

## Output Files

The job produces four primary output files in the target directory:

### 1. Raw Data JSON

- Contains the raw occurrence data as a JSON array
- Used for serving via GraphQL APIs
- Each record includes all extracted fields from the database

### 2. Combined GeoJSON

- GeoJSON FeatureCollection containing all occurrences
- Features include:
  - Geometry: Point in EPSG:3857 (Web Mercator)
  - Properties: Pre-computed WebGL shader attributes
  - Species colors as normalized RGB/RGBA values
  - Filter-relevant attributes pre-extracted

### 3. Presence GeoJSON

- GeoJSON FeatureCollection containing only presence occurrences
- Same structure as combined GeoJSON
- Enables presence-only visualization layers

### 4. Absence GeoJSON

- GeoJSON FeatureCollection containing only absence occurrences
- Same structure as combined GeoJSON
- Enables absence-only visualization layers

### Compressed Variants

Each output file is automatically compressed to:

- `.gz` (gzip) - Widely supported, good compression ratio
- `.br` (Brotli) - Modern format, better compression ratio

> **Example:** `data.geojson` produces `data.geojson.gz` and `data.geojson.br`

## Logging

The job uses [Winston](https://github.com/winstonjs/winston) for logging. Log messages include:

- Processing progress (batches processed, features counted)
- File write confirmations with record/feature counts
- Compression statistics (original size, compressed size, ratio)
- Error details when failures occur

Log levels:

- `error` - Critical failures
- `warn` - Warnings and recoverable issues
- `info` - Processing progress and results (default)
- `debug` - Detailed debugging information

## Customization

### Modifying Data Processing

To change how data is processed:

1. **Edit the SQL query** in `sql/occurrence_data.sql` to change the source data
2. **Modify preprocessing** in `src/preprocess/` to change coordinate handling, coloring, or attribute extraction
3. **Adjust batch size** by setting the `BATCH_SIZE` environment variable (default: 1000)

### Adding New Output Formats

To add additional output formats:

1. Create a new processor in `src/preprocess/`
2. Add it to the processing pipeline in `src/index.ts`
3. Configure the file paths in the atomic operations configuration

### Changing Compression Formats

The compression module in `src/compress/index.ts` supports gzip and Brotli by default. To modify:

1. Edit `DEFAULT_FORMATS` in `src/compress/index.ts`
2. Or pass custom formats to `compressFileToFormats()`

## Troubleshooting

### Common Issues

| Issue                                  | Solution                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Error: SQL_QUERIES_FOLDER is not set` | Set `SQL_QUERIES_FOLDER` to the path containing SQL files. In container, use `/home/app/app/sql` |
| Database connection refused            | Verify `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PDATABASE` are correct                   |
| No output files created                | Check that the output directory exists and is writable                                           |
| Memory issues with large datasets      | Reduce `BATCH_SIZE` environment variable (default: 1000)                                         |

### Verbose Logging

Enable debug logging for detailed troubleshooting:

```bash
LOGGER_LEVEL=debug ./justw node-start
```

### Testing Database Connection

Verify your PostgreSQL connection independently:

```bash
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PDATABASE
```

## Updating just

The [utility](https://just.systems/) offers a way to setup and thus programmatically run project commands.

This [script](./justw) acts as a wrapper that automatically downloads (if not downloaded) a compiled version of the just binary into the `.just` folder and run the just commands.

### Updating/changing the version of just in the script

To update and use a specific version of just, head to the [GitHub releases](https://github.com/casey/just/releases) and identify the target version then:

1. Update the `JUST_VERSION` in the [script](./justw) with the target version.
2. Download the checksum file listed under the specific release's assets. The file is currently named `SHA256SUMS`.
3. Run the following command to get the checksum hash against the downloaded checksum file.

   ```bash
   # Update with path to where the downloaded checksum file is locally.
   PATH_TO_CHECKSUM_FILE=SHA256SUMS

   shasum -a 256 $PATH_TO_CHECKSUM_FILE
   ```

4. Update the `CHECKSUMS_FILE_HASH` in the [script](./justw) with the value outputted from the previous command.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `./justw format` to format and lint
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About Vector Atlas

OccurrenceGeoJob is part of the [Vector Atlas](https://vectoratlas.org/) project, an initiative by the [International Centre of Insect Physiology and Ecology (icipe)](https://www.icipe.org/) to map and monitor vector-borne diseases in Africa.
