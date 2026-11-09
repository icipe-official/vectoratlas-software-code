# Fix: NA values misrepresented as 0 / 0.0 / false during ingest

Date: 2026-11-09 · Code: `src/IngestionAPI` (+ one API migration)

## Root cause

- `prepare_aligned_csv` (`src/IngestionAPI/lib.py`) reads the upload with pandas
  `read_csv` (default NA parsing) and writes it back with `to_csv`, so every
  `NA`/empty cell becomes an empty string `""` in the aligned pipe-delimited CSV.
- `csv.DictReader` then yields `""`, but `is_na()` only matched `na`/`n/a`, so
  `""` was **not** treated as NA.
- `get_int_val`/`get_float_val` returned `0`/`0.0` on parse failure;
  `get_bool_val` returned `False` for anything not in the yes-list; the
  `get_*_key_val` helpers defaulted missing keys to `"0"`.
- Result: NA in any numeric column was stored as `0`, booleans as `false`.
  Columns are mostly `character varying`, so they stored the text `'0.0'` /
  `'False'`; genuinely typed numeric/bool columns stored real `0`/`false`.

Observed in existing data: `site.latitude_2 = '0.0'` in ~6459 rows,
`sample.occurrence_n_1 = 0`, `occurrence.month_start = 0`, etc.

## Fix

1. `src/IngestionAPI/lib.py`
   - `is_na()` now also matches `""`, `nan`, `null`, and `None`.
   - `get_int_val`/`get_float_val` return `None` for NA/unparseable (also NaN/inf
     for floats); `get_bool_val` returns `None` for NA/empty/unknown (explicit
     no-list still maps to `False`); `get_*_key_val` default to `None` instead of `"0"`;
     `datetime_from_month_year` is None-safe.
2. `src/IngestionAPI/request_templates.py` (append-only)
   - New `SQLTemplate` wrapper: `.format()` renders `None` kwargs as a sentinel,
     which is then rewritten to a bare SQL `NULL` whether the placeholder was
     quoted (`E'...'`, `'...'`) or bare. All `template_*` are wrapped; no template
     text changed, so varchar booleans still store `'True'`/`'False'` exactly as before.
3. `src/API/src/db/migrations/1790928435408-enable-null-on-columns.ts` — makes the
   affected columns nullable so NULL can actually be stored.
4. `site.admin_level_1` was hardcoded to `0` since the initial ingest commit (the
   commented-out getter used a wrong key `"admin level_1"` with a space, so it could
   never have worked; no reason documented anywhere). It now maps from the CSV
   (`get_string_key_val`), NA -> `''`.

Text columns are unchanged: NA still becomes `""` there, by design.

## Scope

All numeric/bool ingest placeholders (159 call sites across the INSERT templates)
are covered by the getter fix; all are nullable after the migration except
`site.latitude`, `site.longitude`, `site.location` (NOT NULL). A row with NA
primary coordinates now fails loudly at insert instead of silently storing
`POINT(0 0)` ("Null Island"); `validate_coordinates` already flags such rows as
invalid upstream.

## Verification

- Unit checks on the getters + template rendering (NULL rendered bare, no
  `None`/`'NULL'` tokens, `E'True'`/`E'False'` preserved) — pass.
- Real DB (rolled back): 5-row chunk of the test CSV (`va.data_20260616.csv`,
  41,055 rows) ingests with `occurrence_n_*`, `month_start`, `latitude_2`,
  `reference.year`, ... as NULL; a synthetic all-NA row produces NULLs across
  occurrence/site/reference. No stray rows.
- Re-upload into a fresh database (`mva_new`) shows NULLs where the old database
  had zeros (e.g. `latitude_2`: 6459 NULL vs 0 `'0.0'`; `month_start`: 6033 NULL).

## Dedup nuances (context for interpreting data)

- `site` dedups on `latitude`+`longitude` only, so pre-fix rows keep their
  misrepresented values (`'0.0'` etc.) even after re-upload — a fresh DB +
  re-upload is needed to backfill them.
- `sample` has no dedup at all (`# TODO` in code); `occurrence` always inserts;
  bionomics/IR detail rows are per-occurrence and re-uploads duplicate them.
- `reference` dedup breaks when `year` is NULL (normalized match never hits).
- `recorded_species` is split into `species` (one row per species name) +
  `recorded_species.species` FK with a NULL-safe unique index on
  `(species, species_id_1, species_id_2, species_notes)` — see
  `docs/occurrence-data-pipeline.md`.
- Intentional zero-defaults that are NOT NA-driven and remain unchanged:
  `occurrence.download_count`, and the IR section zeros
  (`infection.eir`, `eir_days`, `sporozoite_rate_*`, `no_per_pool`).
