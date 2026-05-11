#!/bin/bash

# This script trims the generated Postgres dump to only include data 
# insertion (COPY) and sequence updates, making it usable as a shared test data script.

INPUT_FILE="db_dump.sql"
OUTPUT_FILE="db_dump.trimmed.sql"

# Tables to ignore completely due to schema drift
IGNORE_TABLES="exportJob|genotypicRepresentativeness|insecticideResistanceBioassays"

echo "-- Trimmed test data script" > "$OUTPUT_FILE"

# Pass 1: Truncate tables grouped by database
echo "-- Truncating tables" >> "$OUTPUT_FILE"
awk -v ignore="$IGNORE_TABLES" '
/^\\connect/ { print ""; print $0; next }
/^COPY / {
    tableName = $2
    if (tableName !~ ignore) {
        print "TRUNCATE " tableName " CASCADE;"
    }
}
' "$INPUT_FILE" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"

# Pass 2: Insert data and update sequences
echo "-- Inserting data" >> "$OUTPUT_FILE"
awk -v ignore="$IGNORE_TABLES" '
BEGIN {
    in_copy = 0
    skip_copy = 0
}
/^\\connect/ { 
    print ""
    print $0
    print "SET session_replication_role = replica;"
    print "SET default_transaction_read_only = off;"
    print "SET client_encoding = \047UTF8\047;"
    print "SET standard_conforming_strings = on;"
    print ""
    in_copy=0
    skip_copy=0
    next 
}
/^COPY / {
    tableName = $2
    if (tableName ~ ignore) {
        skip_copy = 1
        next
    }
    skip_copy = 0
    in_copy = 1
    print $0
    next 
}
/^\\\.$/ { 
    if (skip_copy) {
        skip_copy = 0
        next
    }
    if (in_copy) { 
        print
        print ""
        in_copy = 0 
    } 
    next 
}
/^SELECT pg_catalog\.setval/ { print; print ""; next }
{ 
    if (skip_copy) next
    if (in_copy) print 
}
' "$INPUT_FILE" >> "$OUTPUT_FILE"

echo "Successfully trimmed $INPUT_FILE into $OUTPUT_FILE"