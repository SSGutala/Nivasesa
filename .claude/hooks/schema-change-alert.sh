#!/bin/bash
# Schema change alert hook
# Warns when Prisma schema files are modified
# Non-blocking - just provides helpful reminders

set -e

INPUT=$(cat)
file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[ -z "$file_path" ] && exit 0

# Check if this is a Prisma schema file
if [[ "$file_path" == *"prisma/schema"* ]] || [[ "$file_path" == *".prisma" ]]; then
  echo "" >&2
  echo "📋 SCHEMA CHANGE DETECTED" >&2
  echo "─────────────────────────────────────" >&2
  echo "After saving, remember to run:" >&2
  echo "" >&2
  echo "  1. npx prisma format     # Format schema" >&2
  echo "  2. npx prisma generate   # Regenerate client" >&2
  echo "  3. npx prisma db push    # Sync to database" >&2
  echo "" >&2
  echo "For production migrations:" >&2
  echo "  npx prisma migrate dev --name <description>" >&2
  echo "─────────────────────────────────────" >&2
fi

# Always allow the operation (non-blocking)
exit 0
