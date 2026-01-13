#!/bin/bash
# Alias script for running Claude with --dangerously-skip-permissions
#
# SAFETY: Only use in:
#   - Docker containers (recommended)
#   - Isolated development environments
#   - Well-scoped, clearly defined tasks
#
# NEVER use in directories with:
#   - Production secrets
#   - Unbackup data
#   - System configuration files
#
# Usage:
#   ./scripts/claude-dangerous.sh                    # Normal dangerous mode
#   ./scripts/claude-dangerous.sh --docker           # Run in Docker first
#
# Or add alias to ~/.zshrc or ~/.bashrc:
#   alias clauded='/path/to/nivasesa/scripts/claude-dangerous.sh'

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check if --docker flag is passed
if [[ "$1" == "--docker" ]]; then
    echo "Starting Docker development environment..."

    # Build and start container
    docker-compose -f "$PROJECT_DIR/docker/docker-compose.dev.yml" up -d --build

    echo ""
    echo "Docker container started. To use Claude in the container:"
    echo ""
    echo "  docker exec -it nivasesa-dev bash"
    echo "  claude --dangerously-skip-permissions"
    echo ""
    echo "Or run directly:"
    echo "  docker exec -it nivasesa-dev claude --dangerously-skip-permissions"
    echo ""
    exit 0
fi

# Safety checks
echo "=== Claude Dangerous Mode Safety Check ==="
echo ""

# Check for .env files
if ls "$PROJECT_DIR"/.env* 1>/dev/null 2>&1; then
    echo "WARNING: .env files detected in project"
    echo "  These are protected by hooks, but exercise caution."
    echo ""
fi

# Check git status
UNCOMMITTED=$(git -C "$PROJECT_DIR" status --porcelain | wc -l)
if [[ $UNCOMMITTED -gt 0 ]]; then
    echo "NOTE: $UNCOMMITTED uncommitted changes detected"
    echo "  Consider committing before dangerous mode session."
    echo ""
fi

# Confirm
echo "You are about to run Claude with --dangerously-skip-permissions"
echo "Project: $PROJECT_DIR"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Run Claude
cd "$PROJECT_DIR"
exec claude --dangerously-skip-permissions "$@"
