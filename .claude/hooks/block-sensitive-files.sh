#!/bin/bash
# Pre-edit hook - blocks modifications to sensitive files
# Returns exit code 2 to block the operation
#
# Security Policy:
# - .env.example files are ALLOWED (no secrets, safe for git)
# - .env files in services/* are ALLOWED (local dev databases)
# - Root .env files are BLOCKED (may contain production secrets)
# - Production configs are BLOCKED

set -e

INPUT=$(cat)
file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[ -z "$file_path" ] && exit 0

# Always allow .env.example files (they contain no secrets)
if [[ "$file_path" == *".env.example"* ]]; then
  exit 0
fi

# Allow .env files in services/ directory (local development)
if [[ "$file_path" == *"services/"*".env"* ]]; then
  exit 0
fi

# Allow .env files in apps/ directory (local development)
if [[ "$file_path" == *"apps/"*".env"* ]]; then
  exit 0
fi

# List of strictly protected file patterns
PROTECTED_PATTERNS=(
  "/.env"              # Root .env only
  ".env.production"    # Production configs
  ".env.prod"          # Production configs
  "secrets/"           # Secrets directory
  ".git/"              # Git internals
  "node_modules/"      # Dependencies
  "credentials.json"   # Service account keys
  "*.pem"              # Private keys
  "*.key"              # Private keys
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$file_path" == *"$pattern"* ]]; then
    echo "BLOCKED: Cannot modify protected file: $file_path" >&2
    echo "This file contains sensitive data. Please modify manually if needed." >&2
    exit 2  # Exit code 2 blocks the operation
  fi
done

exit 0
