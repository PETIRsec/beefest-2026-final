#!/bin/bash

git stash
git checkout main
git pull
chmod +x .script/find_src_and_execute.sh
.script/find_src_and_execute.sh
chmod +x .script/find_directory_and_install_or_sync.sh
.script/find_directory_and_install_or_sync.sh