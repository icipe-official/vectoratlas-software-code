# Vector Atlas API Specification

This is the OpenAPI specification that defines the contract between the front-end and the back-end for the Vector Atlas Project.

Current OpenAPI specification in use: [3.1.0](https://spec.openapis.org/oas/v3.1.0.html)

**Documentation Status:** This README documents the File Service API for the Vector Atlas Project.

## Table of Contents

- [Project Structure](#project-structure)
- [API Architecture Overview](#api-architecture-overview)
- [File Service Endpoints](#file-service-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
  - [Validating the specification](#validating-the-specification)
  - [Generating a single bundled OpenAPI file](#generating-a-single-bundled-openapi-file)
  - [Previewing the specification locally](#previewing-the-specification-locally)

## Project Structure

The OpenAPI specification is organized into separate files for maintainability:

```
openapi/
├── openapi.yaml              # Main OpenAPI specification file
├── bundled.yaml             # Bundled single-file version
├── README.md               # This documentation
├── paths/
│   └── file/               # File Service endpoint definitions
│       ├── files.yaml          # GET /files - List files
│       ├── upload.yaml         # POST /files/upload - Upload file
│       ├── file.yaml           # GET/PUT/DELETE /files/{fileIdentifier}
│       ├── download.yaml       # GET /files/{fileIdentifier}/download
│       ├── compressed.yaml     # GET /files/{fileIdentifier}/compressed
│       ├── compressed_upload.yaml # POST /files/{fileIdentifier}/compressed/upload
│       ├── compressed_single.yaml # PUT/DELETE /files/{fileIdentifier}/compressed/{compressionIdentifier}
│       ├── preview.yaml        # GET /files/{fileIdentifier}/preview
│       ├── preview_upload.yaml  # POST /files/{fileIdentifier}/preview/upload
│       └── preview_single.yaml  # PUT/DELETE /files/{fileIdentifier}/preview/{previewIdentifier}
├── schemas/
│   ├── common/              # Common schemas
│   │   ├── error.yaml          # Error response schema
│   │   └── pagination.yaml     # Pagination schema
│   └── file/                # File Service schemas
│       ├── file.yaml           # File entity schema
│       ├── file_compression.yaml # Compressed file schema
│       ├── file_preview.yaml   # Preview file schema
│       ├── file_list.yaml      # File list schema
│       ├── file_upload.yaml    # File upload schema
│       └── file_metadata.yaml  # File metadata schema
├── responses/
│   ├── common/              # Common responses
│   │   └── error.yaml          # Error responses
│   └── file/                # File Service responses
│       ├── file.yaml           # Single file response
│       ├── file_list.yaml      # File list response
│       ├── file_download.yaml  # File download response
│       └── file_metadata.yaml  # File metadata response
└── parameters/
    ├── common/              # Common parameters
    │   └── pagination.yaml     # Pagination parameters
    └── file/                # File Service parameters
        ├── file_identifier.yaml # File identifier (UUID or slug)
        ├── compression_identifier.yaml # Compressed file identifier (UUID or slug)
        ├── preview_identifier.yaml # Preview file identifier (UUID or slug)
        ├── folder_name.yaml    # Folder name filter parameter
        └── search_query.yaml    # Search query parameter
```

## API Architecture Overview

The Vector Atlas API provides a File Service for managing files, their compressed versions, and previews. The service is designed to support:

- **File Upload**: Upload new files using multipart/formdata format
- **File Download**: Download files with support for preview and compression via query parameters
- **File Metadata**: Retrieve file metadata and information
- **File Listing**: List and search files with pagination
- **Compressed Versions**: Upload compressed versions of files
- **Previews**: Upload preview versions (thumbnails, etc.) of files

### Key Design Decisions

1. **Unified File Identifier**: The `{fileIdentifier}` path parameter accepts both UUID and slug. The system first attempts to parse the identifier as a UUID. If that fails, it treats it as a slug.

2. **Simplified Endpoints**: 
   - Single `GET /files/{fileIdentifier}` endpoint returns file metadata (JSON)
   - `PUT /files/{fileIdentifier}` endpoint for updating file metadata and optionally replacing file content
   - Separate `GET /files/{fileIdentifier}/download` endpoint for binary downloads with query parameters

3. **Download Query Parameters**: The download endpoint uses query parameters to provide flexibility:
   - `preview=true` - Download the preview version of the file
   - `compression=gzip|brotli|br` - Request a specific compression algorithm
   - `attachment=true` - Force download with Content-Disposition: attachment header

4. **HTTP Caching**: The download endpoint implements proper HTTP caching with:
   - `Cache-Control: no-cache, must-revalidate`
   - `Last-Modified` header
   - `ETag` header for entity tag validation
   - Returns `304 Not Modified` when appropriate
   - Respects standard HTTP caching request headers (`If-None-Match`, `If-Modified-Since`, `Accept-Encoding`)

### Authentication

All write operations (upload, delete) require JWT authentication via Bearer token.

## File Service Endpoints

The File Service provides the following endpoints:

### File Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | List files with optional filtering and pagination |
| POST | `/files/upload` | Upload a new file using multipart/formdata |
| GET | `/files/{fileIdentifier}` | Get file metadata by UUID or slug |
| PUT | `/files/{fileIdentifier}` | Update file metadata or replace file content |
| DELETE | `/files/{fileIdentifier}` | Delete a file by UUID or slug |

### File Download

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files/{fileIdentifier}/download` | Download file binary with optional query params |

**Query Parameters for Download:**
- `preview` (boolean): Download preview version if true. Default: false
- `compression` (string): Request specific compression - `gzip`, `brotli`, or `br`
- `attachment` (boolean): Force download with `Content-Disposition: attachment` header. If true, sets the header with filename. If false or omitted, defaults to inline or omits the header (browser decides)

**Request Headers (Documented in OpenAPI spec):**
- `Accept-Encoding` - Client's accepted compression algorithms
- `If-None-Match` - ETag value for cache validation
- `If-Modified-Since` - Timestamp for cache validation

**Response Headers:**
- `Content-Disposition`: Attachment with filename (if attachment=true) or inline/omitted
- `Content-Type`: File MIME type
- `Content-Length`: File size in bytes
- `Content-Encoding`: Compression encoding (if applied)
- `Cache-Control`: `no-cache, must-revalidate`
- `Last-Modified`: File modification timestamp
- `ETag`: Entity tag for cache validation

**Response Codes:**
- `200 OK` - File downloaded successfully
- `304 Not Modified` - File has not changed (when cache validation passes)
- `404 Not Found` - File not found

### Compressed Versions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files/{fileIdentifier}/compressed` | List all compressed versions of a file |
| POST | `/files/{fileIdentifier}/compressed/upload` | Upload a compressed version of a file |
| PUT | `/files/{fileIdentifier}/compressed/{compressionIdentifier}` | Update compressed file metadata or replace file |
| DELETE | `/files/{fileIdentifier}/compressed/{compressionIdentifier}` | Delete a compressed file |

### Previews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files/{fileIdentifier}/preview` | Get preview information for a file |
| POST | `/files/{fileIdentifier}/preview/upload` | Upload a preview version of a file |
| PUT | `/files/{fileIdentifier}/preview/{previewIdentifier}` | Update preview file metadata or replace file |
| DELETE | `/files/{fileIdentifier}/preview/{previewIdentifier}` | Delete a preview file |

## Database Schema

The File Service is backed by the following database entities:

### File

```
file(
  id: uuid                  # Unique identifier
  folder_name: text         # Name of the folder containing the file
  name: text (nullable)     # Original filename. Can be null for temporary files
  slug: text (nullable)     # Short unique name for URL-friendly access. Can be null for temporary files
  mime_type: text           # MIME type of the file
  size: integer             # Size of the file in bytes
  created_on: timestamp     # When the file was created
  last_updated_on: timestamp # When the file was last updated
)
```

### File Compression

```
file_compression(
  id: uuid                  # Unique identifier
  file_id: uuid             # Reference to the original file
  mime_type: text           # MIME type of the compressed file
  size: integer             # Size of the compressed file in bytes
  created_on: timestamp     # When the compressed file was created
  slug: text (nullable)     # Short unique name for URL-friendly access. Can be null
)
```

### File Preview

```
file_preview(
  id: uuid                  # Unique identifier
  file_id: uuid             # Reference to the original file
  mime_type: text           # MIME type of the preview file
  size: integer             # Size of the preview file in bytes
  created_on: timestamp     # When the preview file was created
  slug: text (nullable)     # Short unique name for URL-friendly access. Can be null
  preview_type: text        # Type of preview (thumbnail, small, medium, large)
)
```

## Storage Paths

Files are stored without extensions since MIME type is captured in the database.

**Structure:**
```
<ROOT_FOLDER>/
├── <FOLDER_NAME>/
│   └── <FILE_UUID>/
│       ├── original                       # Original file (always named 'original')
│       ├── preview                        # Preview file (always named 'preview')
│       └── compressed/                    # Compressed versions folder
│           ├── <COMPRESSION_FILE_UUID>    # Compressed file named by its UUID
│           └── <COMPRESSION_FILE_UUID>    # Multiple compressed versions
└── <FILE_UUID>/
    └── original                          # Temporary file (no folder_name = temporary)
```

**Full Tree Example:**
```
storage_root/
├── occurrence_data/
│   └── 123e4567-e89b-12d3-a456-426614174000/
│       ├── original                       # Original mosquito_occurrence.csv
│       ├── preview                        # Preview thumbnail image
│       └── compressed/
│           ├── 223e4567-e89b-12d3-a456-426614174001  # Gzip version
│           └── 323e4567-e89b-12d3-a456-426614174002  # Brotli version
└── 456e7890-c12d-34ef-5678-90ab12345678/
    └── original                           # Temporary file (no folder_name)
```

**Path Examples:**
- Original file with folder: `{storage_root}/occurrence_data/123e4567-e89b-12d3-a456-426614174000/original`
- Preview file: `{storage_root}/occurrence_data/123e4567-e89b-12d3-a456-426614174000/preview`
- Compressed file (gzip): `{storage_root}/occurrence_data/123e4567-e89b-12d3-a456-426614174000/compressed/223e4567-e89b-12d3-a456-426614174001`
- Original file without folder (temporary): `{storage_root}/456e7890-c12d-34ef-5678-90ab12345678/original`

**Note:** Files without a `folder_name` are considered temporary files and are stored directly under the storage root.

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
