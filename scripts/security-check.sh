#!/bin/bash
# Security check script for AI-generated code
# Run before committing: ./scripts/security-check.sh

set -e

echo "=== Nivasesa Security Check ==="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

# Check for hardcoded secrets
echo "Checking for potential hardcoded secrets..."
if grep -rn --include="*.ts" --include="*.tsx" --include="*.js" \
    -E "(password|secret|api_key|apikey|token)\s*[:=]\s*['\"][^'\"]+['\"]" \
    --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null | \
    grep -v "placeholder" | grep -v "example" | grep -v "test" | grep -v ".env"; then
    echo -e "${YELLOW}WARNING: Potential hardcoded secrets found above${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK${NC}"
fi
echo ""

# Check for dangerouslySetInnerHTML
echo "Checking for dangerouslySetInnerHTML usage..."
if grep -rn --include="*.tsx" --include="*.jsx" "dangerouslySetInnerHTML" \
    --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null; then
    echo -e "${YELLOW}WARNING: dangerouslySetInnerHTML found - ensure content is sanitized${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK${NC}"
fi
echo ""

# Check for eval usage
echo "Checking for eval() usage..."
if grep -rn --include="*.ts" --include="*.tsx" --include="*.js" \
    -E "\beval\s*\(" --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null; then
    echo -e "${RED}CRITICAL: eval() found - this is a security risk${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK${NC}"
fi
echo ""

# Check for console.log with sensitive data patterns
echo "Checking for potential sensitive data in console.log..."
if grep -rn --include="*.ts" --include="*.tsx" \
    -E "console\.(log|info|debug).*\b(password|token|secret|key)\b" \
    --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null; then
    echo -e "${YELLOW}WARNING: console.log may contain sensitive data${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK${NC}"
fi
echo ""

# Check for HTTP (non-HTTPS) URLs in fetch calls
echo "Checking for non-HTTPS fetch calls..."
if grep -rn --include="*.ts" --include="*.tsx" \
    -E "fetch\s*\(\s*['\"]http://" \
    --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null; then
    echo -e "${YELLOW}WARNING: HTTP (non-HTTPS) fetch calls found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK${NC}"
fi
echo ""

# Check for unvalidated redirects
echo "Checking for potential open redirects..."
if grep -rn --include="*.ts" --include="*.tsx" \
    -E "redirect\s*\(\s*[^'\"]+\s*\)" \
    --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null | \
    grep -v "redirect('/" | grep -v 'redirect("/' | grep -v "NextResponse.redirect"; then
    echo -e "${YELLOW}WARNING: Check for open redirect vulnerabilities${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK${NC}"
fi
echo ""

# Summary
echo "=== Summary ==="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}No security issues detected!${NC}"
else
    echo -e "${YELLOW}Found $ISSUES_FOUND potential issue(s) to review${NC}"
fi
echo ""

# Run build to catch type errors
echo "Running build check..."
npm run build > /dev/null 2>&1 && echo -e "${GREEN}Build: OK${NC}" || echo -e "${RED}Build: FAILED${NC}"

exit 0
