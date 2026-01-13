---
name: security-review
description: Perform security reviews of Nivasesa code. Use when reviewing code for vulnerabilities, checking credential exposure, or assessing security best practices.
allowed-tools: Read, Grep, Glob
---

# Security Review Skill

## Purpose
Review Nivasesa code for security vulnerabilities following OWASP guidelines.

## Quick Checks

### 1. Credential Exposure
```bash
# Find potential secrets
grep -rn --include="*.ts" --include="*.tsx" \
  -E "(password|secret|api_key|token)\s*[:=]\s*['\"]" \
  --exclude-dir=node_modules .
```

### 2. Dangerous Patterns
```bash
# eval usage
grep -rn "eval(" --include="*.ts" .

# innerHTML
grep -rn "dangerouslySetInnerHTML" --include="*.tsx" .

# SQL in strings
grep -rn "SELECT.*FROM" --include="*.ts" .
```

### 3. Auth Checks
```bash
# Server actions without auth
grep -A5 "export async function" actions/*.ts | grep -v "auth\|session"
```

## Review Checklist

### Input Validation
- [ ] User inputs validated server-side
- [ ] File uploads restricted by type/size
- [ ] URLs validated before redirect
- [ ] Numbers checked for range

### Authentication
- [ ] Protected routes use middleware
- [ ] Session checked before mutations
- [ ] Password reset tokens expire
- [ ] Logout invalidates session

### Authorization
- [ ] Users can't access others' data
- [ ] Role checks on admin functions
- [ ] API routes check permissions

### Data Protection
- [ ] Passwords never in responses
- [ ] Errors don't expose internals
- [ ] Logs don't contain secrets
- [ ] HTTPS enforced

## Nivasesa-Specific

### Files to Check
- `middleware.ts` - Route protection
- `auth.ts` - Auth configuration
- `actions/*.ts` - Server mutations
- `lib/permissions.ts` - RBAC logic

### Protected Data
- User passwords (hashed)
- API keys in .env
- Session tokens
- Verification tokens

## Response Format

### Finding Template
```
**Severity**: CRITICAL | HIGH | MEDIUM | LOW
**Type**: [OWASP category]
**Location**: file:line
**Description**: What's wrong
**Impact**: What could happen
**Fix**: How to remediate
```

### Example
```
**Severity**: HIGH
**Type**: A03:2021 Injection
**Location**: actions/search.ts:45
**Description**: User input passed directly to query
**Impact**: Potential data exfiltration
**Fix**: Use parameterized query with Prisma
```
