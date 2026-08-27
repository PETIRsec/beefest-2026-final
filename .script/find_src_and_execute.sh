#!/bin/bash
find . -type d -name "src" | while read -r directory; do
    if [[ ! "$directory" == *"Template-Challenge"* ]]; then
        python3 .script/execute_start.py "$directory"
        if [ $? -ne 0 ]; then
            echo "Failed to execute $directory/start.sh"
            exit 1
        fi
    fi
done