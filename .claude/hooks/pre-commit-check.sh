#!/bin/bash
# Pre-commit quality gate hook
# Runs before git commit to ensure code quality
# Returns exit code 2 to block the operation

set -e

INPUT=$(cat)
command=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only run for git commit commands
if [[ "$command" != git\ commit* ]]; then
  exit 0
fi

echo "Running pre-commit quality checks..." >&2

# Change to project root
cd "$CLAUDE_PROJECT_DIR" || exit 0

# Track failures
FAILED=0

# TypeScript check
echo "  → Type checking..." >&2
if ! npm run typecheck --silent 2>/dev/null; then
  echo "  ✗ TypeScript errors found" >&2
  FAILED=1
fi

# Lint check (non-blocking warning)
echo "  → Linting..." >&2
if ! npm run lint --silent 2>/dev/null; then
  echo "  ⚠ Lint warnings found (non-blocking)" >&2
fi

# Test check (if tests exist)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
  echo "  → Running tests..." >&2
  if ! npm run test:run --silent 2>/dev/null; then
    echo "  ✗ Tests failed" >&2
    FAILED=1
  fi
fi

if [ $FAILED -eq 1 ]; then
  echo "" >&2
  echo "BLOCKED: Quality checks failed. Fix errors before committing." >&2
  echo "Run 'npm run typecheck' and 'npm run test:run' to see details." >&2
  exit 2
fi

echo "  ✓ All checks passed" >&2
exit 0
