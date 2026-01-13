---
name: beads
description: Issue tracking with beads (bd command). Use when managing tasks, tracking work across sessions, creating issues, or checking project status.
allowed-tools: Bash
---

# Beads Issue Tracking Skill

Beads is a git-native issue tracker for managing work across Claude sessions.

## Quick Reference

### Session Protocol
```bash
# START of session
bd prime

# END of session (CRITICAL - never skip)
git status
git add <files>
bd sync
git commit -m "..."
bd sync
git push
```

### Finding Work
```bash
bd ready                      # Issues with no blockers
bd list --status=open         # All open issues
bd list --status=in_progress  # Currently active
bd show <id>                  # Issue details
bd stats                      # Project overview
```

### Working on Issues
```bash
bd update <id> --status=in_progress   # Claim work
bd close <id>                         # Mark complete
bd close <id1> <id2> <id3>           # Close multiple
bd close <id> --reason="explanation"  # Close with note
```

### Creating Issues
```bash
bd create --title="Fix bug" --type=bug --priority=2
bd create --title="New feature" --type=feature --priority=1
bd create --title="Refactor X" --type=task --priority=3
```

**Priority levels**: 0=critical, 1=high, 2=medium, 3=low, 4=backlog
**Types**: bug, feature, task, epic

### Dependencies
```bash
bd dep add <issue> <depends-on>   # issue depends on depends-on
bd blocked                        # Show blocked issues
```

### Sync
```bash
bd sync              # Sync with git remote
bd sync --status     # Check without syncing
```

## Best Practices

1. **Always `bd prime` at session start** - Loads context
2. **Always `bd sync` before ending** - Persists changes
3. **One `in_progress` at a time** - Focus on single task
4. **Close immediately when done** - Don't batch completions
5. **Use TodoWrite for subtasks** - Beads for cross-session, TodoWrite for within-session

## Rollback & Recovery

### Reopen Accidentally Closed Issues
```bash
bd update <id> --status=open
bd update <id> --add-note="Reopened: [reason]"
```

### When Things Go Wrong
```bash
# Undo claim (back to open)
bd update <id> --status=open --add-note="Unclaimed: [reason]"

# Mark as blocked
bd update <id> --add-note="BLOCKED: waiting on [dependency]"

# Split issue that's too large
bd create --title="[Part 1 of X]" --type=task
bd create --title="[Part 2 of X]" --type=task
bd close <original-id> --reason="Split into smaller tasks"
```

## Issue Title Templates

Use consistent prefixes for clarity:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `[DB]` | Database/schema change | `[DB] Add Favorite model` |
| `[API]` | Server action or endpoint | `[API] Create toggleFavorite action` |
| `[UI]` | Component work | `[UI] Build FavoriteButton component` |
| `[PAGE]` | Page/route work | `[PAGE] Add favorites listing page` |
| `[TEST]` | Test coverage | `[TEST] Cover favorites with tests` |
| `[FIX]` | Bug fix | `[FIX] Resolve login redirect loop` |
| `[REFACTOR]` | Code improvement | `[REFACTOR] Extract auth utilities` |
| `[DOCS]` | Documentation | `[DOCS] Update API documentation` |
| `[INFRA]` | Infrastructure | `[INFRA] Configure S3 bucket` |
| `[SECURITY]` | Security work | `[SECURITY] Add rate limiting` |

### Example Issue Creation
```bash
# Feature with standard naming
bd create --title="[DB] Add Notification model" --type=task --priority=1
bd create --title="[API] Create notification actions" --type=task --priority=1
bd create --title="[UI] Build NotificationBell component" --type=task --priority=2
bd create --title="[TEST] Cover notifications with tests" --type=task --priority=2

# Set dependencies
bd dep add <test-id> <api-id>
bd dep add <ui-id> <api-id>
```

## Integration with TodoWrite

```
Beads (bd)           → Cross-session strategic work
TodoWrite            → Single-session task breakdown
```

Example workflow:
1. `bd ready` → Find issue to work on
2. `bd update <id> --status=in_progress` → Claim it
3. Use TodoWrite to break into subtasks
4. Complete subtasks, marking each done
5. `bd close <id>` → Mark beads issue done
6. `bd sync` → Persist

## Common Patterns

### Starting a session
```bash
bd prime
bd ready
bd show <first-ready-issue>
bd update <id> --status=in_progress
```

### Ending a session
```bash
bd close <completed-ids>
git add .
bd sync
git commit -m "Complete <feature>"
bd sync
git push
```

### Creating related issues
```bash
bd create --title="Implement X" --type=feature --priority=1
bd create --title="Test X" --type=task --priority=2
bd dep add <test-id> <implement-id>  # Tests depend on implementation
```

---

## Task Trees (Epic → Story → Task)

Use hierarchical naming to create task trees for crew coordination.

### Creating an Epic Tree

```bash
# 1. Create the Epic
bd create --title="[EPIC] User Dashboard" --type=epic --priority=1

# 2. Create Stories (group by area)
bd create --title="[DASH/api] Backend endpoints" --type=feature --priority=1
bd create --title="[DASH/ui] Dashboard components" --type=feature --priority=1
bd create --title="[DASH/tests] Test coverage" --type=feature --priority=2

# 3. Create Tasks under each Story
bd create --title="[DASH/api] GET /dashboard/stats" --type=task --priority=1
bd create --title="[DASH/api] GET /dashboard/activity" --type=task --priority=1
bd create --title="[DASH/ui] StatsCard component" --type=task --priority=1
bd create --title="[DASH/ui] ActivityFeed component" --type=task --priority=1
bd create --title="[DASH/tests] API endpoint tests" --type=task --priority=2
bd create --title="[DASH/tests] Component tests" --type=task --priority=2

# 4. Set dependencies
bd dep add <ui-statscard> <api-stats>      # UI needs API
bd dep add <tests-api> <api-story>          # Tests need implementation
```

### Tree Structure

```
[EPIC] User Dashboard                    # Epic
├── [DASH/api] Backend endpoints         # Story
│   ├── [DASH/api] GET /dashboard/stats  # Task
│   └── [DASH/api] GET /dashboard/activity
├── [DASH/ui] Dashboard components       # Story
│   ├── [DASH/ui] StatsCard component    # Task
│   └── [DASH/ui] ActivityFeed component
└── [DASH/tests] Test coverage           # Story
    ├── [DASH/tests] API endpoint tests  # Task
    └── [DASH/tests] Component tests
```

### Filtering by Area

```bash
bd list | grep "DASH"           # All dashboard tasks
bd list | grep "DASH/api"       # Backend only
bd list | grep "DASH/ui"        # Frontend only
bd list | grep "DASH/tests"     # Tests only
bd list | grep "EPIC"           # All epics
```

### Closing a Tree (bottom-up)

```bash
# Close tasks first
bd close <task-ids>

# Close stories
bd close <story-ids>

# Close epic last
bd close <epic-id> --reason="Dashboard feature complete"
```

---

## Crew Workflow

For multi-agent parallel development, see [Crew Skill](../crew/SKILL.md).

```bash
# Create tree → Spawn agents → Each agent works on their area
bd list | grep "DASH/api"     # Agent 1: backend
bd list | grep "DASH/ui"      # Agent 2: frontend
bd list | grep "DASH/tests"   # Agent 3: tests
```
