#!/usr/bin/env bash
set -euo pipefail

CONF="src-tauri/tauri.conf.json"

# Read current version
current=$(grep -oP '"version":\s*"\K[^"]+' "$CONF")

IFS='.' read -r major minor patch <<< "$current"

case "${1:-patch}" in
  major) major=$((major + 1)); minor=0; patch=0 ;;
  minor) minor=$((minor + 1)); patch=0 ;;
  patch) patch=$((patch + 1)) ;;
  *)
    echo "Usage: $0 [major|minor|patch]"
    exit 1
    ;;
esac

new_version="${major}.${minor}.${patch}"

# Update version in tauri.conf.json
sed -i "s/\"version\": \"${current}\"/\"version\": \"${new_version}\"/" "$CONF"

echo "Bumped $current -> $new_version OK? (y/N)"

read -r answer

if [[ "$answer" != "y" ]]; then
  echo "Aborting."
  exit 1
fi

git add "$CONF"
git commit -m "chore: bump version to v${new_version}"
git tag "v${new_version}"
git push && git push origin "v${new_version}"
