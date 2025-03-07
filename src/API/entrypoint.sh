#!/bin/bash

# Start the main application command
"$@"

# Overwrite version.txt with the one from the image
cp /tmp/version.txt /usr/src/app/dist/public/version.txt
