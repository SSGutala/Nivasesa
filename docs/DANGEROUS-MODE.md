# Claude Dangerous Mode Guide

## What is `--dangerously-skip-permissions`?

This flag allows Claude to execute commands autonomously without requesting permission for each action. Useful for extended development sessions but risky if misused.

## Quick Start

### Option 1: Use the script (Recommended)
```bash
# From project root
./scripts/claude-dangerous.sh

# Or with Docker (safest)
./scripts/claude-dangerous.sh --docker
```

### Option 2: Add alias to shell
Add to `~/.zshrc` or `~/.bashrc`:
```bash
alias clauded='claude --dangerously-skip-permissions'
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bashrc
```

### Option 3: Docker-first approach (Safest)
```bash
# Start container
docker-compose -f docker/docker-compose.dev.yml up -d

# Run Claude inside container
docker exec -it nivasesa-dev claude --dangerously-skip-permissions
```

## When to Use

**Good use cases:**
- Well-scoped, clearly defined projects
- Extended autonomous sessions (multi-hour builds)
- Greenfield features in isolated branches
- Docker/sandbox environments

**Never use when:**
- Directory contains API keys, secrets, production configs
- Important data without backups
- System configuration files present
- Shared/production environments

## Safety Measures in Place

### 1. Hooks (Automatic)
- `block-sensitive-files.sh` - Blocks .env, secrets, node_modules edits
- `post-edit-security.sh` - Scans for secrets after each edit

### 2. Denied Commands (settings.json)
```json
"deny": [
  "Bash(rm -rf:*)",
  "Bash(sudo:*)",
  "Read(.env*)",
  "Edit(.env*)"
]
```

### 3. Docker Isolation
- Non-root user inside container
- Resource limits (CPU, memory)
- Volume mounts for persistence
- Read-only Claude config mount

## Task Scoping (Critical)

Quality of results depends on how well you scope the task:

**Good prompt:**
```
Build a user registration feature:
- Create app/register/page.tsx with form
- Add actions/register.ts with validation
- Update prisma schema if needed
- Do NOT modify auth.ts or middleware.ts
- Run build when done
```

**Bad prompt:**
```
Add user registration
```

## Pre-Session Checklist

- [ ] Commit current changes (`git status` clean)
- [ ] Backup important data
- [ ] Define file boundaries for the session
- [ ] Set clear success criteria
- [ ] Docker running if using containerized mode

## Recovery

If something goes wrong:

```bash
# See what changed
git status
git diff

# Revert all changes
git checkout -- .

# Revert specific file
git checkout -- path/to/file

# If committed, reset
git reset --soft HEAD~1
```

## Recommended Workflow

```bash
# 1. Start fresh
git checkout -b feature/my-feature
git status  # Should be clean

# 2. Run in Docker
./scripts/claude-dangerous.sh --docker
docker exec -it nivasesa-dev bash

# 3. Inside container
claude --dangerously-skip-permissions
> bd prime
> [Give well-scoped task]

# 4. When done
> bd sync
exit

# 5. Review and commit
git diff
git add .
git commit -m "Feature: ..."
```
