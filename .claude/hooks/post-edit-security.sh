#!/bin/bash
# Post-edit security hook - runs after Write/Edit operations
# Checks for common security issues in modified files

set -e

# Read tool input from stdin
INPUT=$(cat)
file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[ -z "$file_path" ] && exit 0
[ ! -f "$file_path" ] && exit 0

# Only check TypeScript/JavaScript files
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

ISSUES=""

# Check for hardcoded secrets
if grep -qE "(password|secret|api_key|token)\s*[:=]\s*['\"][^'\"]{8,}['\"]" "$file_path" 2>/dev/null; then
  if ! grep -qE "(example|placeholder|test|demo)" "$file_path" 2>/dev/null; then
    ISSUES="${ISSUES}WARNING: Potential hardcoded secret detected\n"
  fi
fi

# Check for eval
if grep -qE "\beval\s*\(" "$file_path" 2>/dev/null; then
  ISSUES="${ISSUES}CRITICAL: eval() usage detected - security risk\n"
fi

# Check for dangerouslySetInnerHTML
if grep -q "dangerouslySetInnerHTML" "$file_path" 2>/dev/null; then
  ISSUES="${ISSUES}WARNING: dangerouslySetInnerHTML found - ensure content is sanitized\n"
fi

# Check for console.log with sensitive patterns
if grep -qE "console\.(log|info|debug).*\b(password|token|secret)\b" "$file_path" 2>/dev/null; then
  ISSUES="${ISSUES}WARNING: console.log may expose sensitive data\n"
fi

# Output issues to stderr (shown to Claude)
if [ -n "$ISSUES" ]; then
  echo -e "Security scan for $file_path:\n$ISSUES" >&2
fi

exit 0
