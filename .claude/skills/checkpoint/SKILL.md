---
name: checkpoint
description: Save current progress state for recovery. Use before risky changes, periodically during long sessions, or before switching major tasks.
allowed-tools: Bash
---

# Checkpoint Skill

Create recovery points during complex work sessions.

## When to Use

- **Before risky changes**: Schema migrations, major refactors
- **Periodically**: Every 30 minutes of sustained work
- **Before context switch**: When switching between major tasks
- **Before experiments**: Testing unfamiliar approaches

## Quick Commands

### Create Checkpoint
```bash
# Sync beads state
bd sync

# Stash current work with timestamp
git stash push -m "checkpoint: $(date '+%Y-%m-%d %H:%M')"

# Or with descriptive name
git stash push -m "checkpoint: before schema migration"
```

### Create Named Checkpoint (Keep Working)
```bash
# Commit current state without pushing
git add .
git commit -m "WIP: checkpoint before [description]"

# Continue working...
```

### List Checkpoints
```bash
# See all stashes
git stash list

# See recent commits (potential checkpoints)
git log --oneline -10
```

## Checkpoint Workflow

### Before Risky Change
```bash
# 1. Save current beads state
bd sync

# 2. Commit if clean stopping point
git add .
git commit -m "WIP: checkpoint before [risky-change]"

# 3. Now make risky change...
```

### Periodic Session Checkpoint
```bash
# Every 30 minutes or so
bd sync
git add .
git stash push -m "checkpoint: $(date '+%H%M') - [brief description]"
git stash pop  # Keep working with same changes
```

### Before Major Context Switch
```bash
# Finishing Feature A, starting Feature B
bd sync
git add .
git commit -m "WIP: Feature A progress - switching to B"

# Now safe to start Feature B
```

## Recovery

See the `rollback` skill for restoring from checkpoints.

## Best Practices

1. **Descriptive names**: Include what you were doing
2. **Sync beads first**: Ensure issue state is saved
3. **Don't over-checkpoint**: Every 30 min is plenty
4. **Clean up old stashes**: `git stash drop stash@{n}`

## Integration with Beads

Checkpoints complement beads:
- **Beads**: Tracks WHAT needs to be done (persists across sessions)
- **Checkpoint**: Saves HOW FAR you've gotten (recoverable state)

```bash
# Good checkpoint routine
bd update <id> --add-note="Checkpoint: completed [step], starting [next]"
bd sync
git stash push -m "checkpoint: $(date '+%H%M')"
```
