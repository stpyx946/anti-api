#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="${1:-}"
VERSION="${2:-}"

if [ -z "$TARGET_DIR" ]; then
    echo "Usage: scripts/sync-winget-pkgs.sh /path/to/winget-pkgs-fork [version]"
    exit 1
fi

if [ -z "$VERSION" ]; then
    VERSION="$(node -p "require('$REPO_ROOT/package.json').version")"
fi

SOURCE_DIR="$REPO_ROOT/packaging/winget/manifests/i/Ink1ing/AntiAPI/$VERSION"
DEST_DIR="$TARGET_DIR/manifests/i/Ink1ing/AntiAPI/$VERSION"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Manifest source not found: $SOURCE_DIR"
    echo "Run: bun run winget:manifest -- --version $VERSION --sha256 <sha256>"
    exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SOURCE_DIR"/*.yaml "$DEST_DIR"/

echo "Synced WinGet manifests to $DEST_DIR"
