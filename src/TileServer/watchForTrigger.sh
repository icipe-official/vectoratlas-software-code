#!/bin/bash

inotifywait --monitor --event modify,create /data |
    while read directory action file; do
        if [[ "$file" = "trigger.txt" ]]; then # Is it the trigger file
            echo "trigger file changed, refreshing the tile server"
            kill -s SIGHUP $(pidof node) 2>/dev/null
        fi
    done