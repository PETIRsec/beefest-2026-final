#!/bin/bash
find . -name "challenge.yml" -type f -execdir bash -c 'echo "${PWD}"' \; | while read -r directory; do
    if [[ ! "$directory" == *"Template-Challenge"* ]]; then
        python3 .script/install_or_sync.py "$directory"
        if [ $? -ne 0 ]; then
            echo "Failed to execute $directory"
            exit 1
        fi
    fi
done