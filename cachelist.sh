#!/bin/bash

# Array of directories to include in the cache, including the root directory
DIRECTORIES=("." "ui" "services" "lib")

# Array of patterns to exclude from the cache
EXCLUDE_LIST=(".git" ".DS_Store" "node_modules")

# Function to generate the list of files from specified directories, excluding specified patterns
generate_file_list() {
  for dir in "${DIRECTORIES[@]}"; do
    find "$dir" -type f | while read -r file; do
      exclude=false
      for pattern in "${EXCLUDE_LIST[@]}"; do
        if [[ "$file" == *"$pattern"* ]]; then
          exclude=true
          break
        fi
      done
      if [ "$exclude" = false ]; then
        echo "$file" | sed -e 's/^.\//\//'
      fi
    done
  done
}

# Print the file list formatted for JavaScript
echo "const FILES_TO_CACHE = ["
generate_file_list | while read -r file; do
  echo "  \"$file\","
done
echo "];"
