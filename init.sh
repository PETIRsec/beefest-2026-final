#!/bin/bash

### Define dynamic values
initial_point=""
decay_point=""
flag_format=""
ip_chall=""

### Example data
# initial_point="500"
# decay_point="30"
# flag_format="FLAG{*}"
# ip_chall="0.0.0.0"

# Parse command line options
mode="all"  # Default mode is to replace all variables

# List of files to process
FILES=("README.md" "Template-Challenge/challenge.yml")

# Replace placeholders in each file
for FILE in "${FILES[@]}"; do
    if [ -f "$FILE" ]; then
        echo "Processing $FILE..."
        
        if [ "$mode" = "all" ]; then
            echo "Applying all template replacements..."
            sed -i "s|{initial_point}|$initial_point|g" "$FILE"
            sed -i "s|{decay_point}|$decay_point|g" "$FILE"
            sed -i "s|{flag_format}|$flag_format|g" "$FILE"
            sed -i "s|{ip_chall}|$ip_chall|g" "$FILE"
        fi
    else
        echo "File $FILE not found, skipping..."
    fi
done

echo "All template values have been applied!"