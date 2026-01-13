---
name: pr-review
description: Review pull requests using Nivasesa team standards. Use when reviewing PRs, checking code quality, or assessing implementation completeness.
allowed-tools: Read, Grep, Glob, Bash
---

# PR Review Skill

## Nivasesa PR Standards

### Code Quality Checklist
- [ ] TypeScript strict mode compliance
- [ ] Functions under 100 lines
- [ ] Descriptive variable/function names
- [ ] No console.log in production code
- [ ] Proper error handling

### Security Checklist
- [ ] No hardcoded secrets
- [ ] Input validation on user data
- [ ] Auth checks on protected routes
- [ ] No SQL injection risks

### Performance Checklist
- [ ] No N+1 database queries
- [ ] Proper use of Prisma includes
- [ ] Images optimized with next/image
- [ ] No unnecessary re-renders

### Testing Checklist
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Types check: `npx tsc --noEmit`

## Review Process

1. **Understand the Change**
   ```bash
   git log --oneline -5
   git diff main...HEAD
   ```

2. **Check Build Status**
   ```bash
   npm run build
   ```

3. **Review File Changes**
   - Focus on `actions/`, `app/`, `lib/`, `components/`
   - Check for pattern consistency
   - Verify imports are correct

4. **Security Scan**
   ```bash
   grep -rn "password\|secret\|token" --include="*.ts" .
   ```

## Feedback Categories

### Praise (what's done well)
Highlight good patterns, clean code, thoughtful design

### Issues (must address)
- Security vulnerabilities
- Logic errors
- Breaking changes
- Missing error handling

### Suggestions (nice to have)
- Code style improvements
- Refactoring opportunities
- Performance optimizations

## Response Template

```markdown
## PR Review: [Title]

### Summary
Brief overview of the changes and their purpose.

### Praise
- Good use of [pattern]
- Clean implementation of [feature]

### Issues
1. **[File:Line]** - [Description]
   - Problem: ...
   - Fix: ...

### Suggestions
- Consider [improvement]
- Could simplify [code]

### Verdict
- [ ] Approved
- [ ] Approved with suggestions
- [ ] Changes requested
```
