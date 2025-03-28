#!/bin/bash

# Search ALL branches for the commit
COMMIT_HASH=$(git log --all --format=%H --grep="Card 2: Complete" -1)

if [ -z "$COMMIT_HASH" ]; then
  echo "Error: Commit not found locally. Try 'git fetch' first."
  exit 1
fi

# Reset and clean untracked files (UNCOMMENT LINE BELOW TO ENABLE CLEANING)
# read -p "This will DELETE UNTRACKED FILES. Continue? (y/n) " -n 1 -r
# [[ $REPLY =~ ^[Yy]$ ]] || exit 1
# git clean -fd

git reset --hard "$COMMIT_HASH"
echo "Successfully reset to commit: $COMMIT_HASH"