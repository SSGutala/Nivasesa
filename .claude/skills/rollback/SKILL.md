---
name: rollback
description: Undo recent changes safely. Use when changes cause problems, experiments fail, or you need to return to a known good state.
allowed-tools: Bash
---

# Rollback Skill

Safely undo changes and return to previous states.

## When to Use

- **Build breaks**: After changes that break the build
- **Tests fail**: Changes introduced regressions
- **Wrong direction**: Feature went in wrong direction
- **Experiment failed**: Tried something that didn't work

## Quick Commands

### Undo Uncommitted Changes

```bash
# Discard changes to specific file
git checkout -- <file>

# Discard all uncommitted changes (CAREFUL!)
git checkout -- .

# Discard changes but keep as stash (safer)
git stash push -m "rollback: discarded changes from $(date '+%H%M')"
```

### Undo Last Commit (Not Pushed)

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard commit and changes
git reset --hard HEAD~1
```

### Restore from Stash

```bash
# List available stashes
git stash list

# Preview stash contents
git stash show -p stash@{0}

# Apply most recent stash
git stash pop

# Apply specific stash
git stash pop stash@{2}

# Apply but keep in stash list
git stash apply stash@{0}
```

### Restore Specific File from History

```bash
# From last commit
git checkout HEAD~1 -- <file>

# From specific commit
git checkout <commit-hash> -- <file>

# From branch
git checkout main -- <file>
```

## Rollback Workflows

### Build Broke After Changes

```bash
# 1. See what changed
git diff

# 2. Stash changes to investigate
git stash push -m "rollback: investigating build failure"

# 3. Verify build works
npm run build

# 4. If it works, changes caused issue
#    If not, problem was pre-existing

# 5. Either fix and re-apply, or discard
git stash pop    # Re-apply changes
# or
git stash drop   # Discard changes
```

### Wrong Implementation Direction

```bash
# 1. Find last good commit
git log --oneline -10

# 2. Create branch to save current work (just in case)
git checkout -b backup/wrong-direction

# 3. Return to main and reset
git checkout main
git reset --hard <good-commit>

# 4. Update beads
bd update <id> --add-note="Rolled back: [reason]"
```

### Experiment Failed

```bash
# If you stashed before experimenting
git stash list
git stash pop stash@{n}  # Restore pre-experiment state

# If you committed
git reset --soft HEAD~1  # Undo commit, keep changes for review
git stash push -m "failed experiment: [description]"
```

### Restore Single File Only

```bash
# See file history
git log --oneline -- <file>

# Restore from specific commit
git checkout <commit> -- <file>

# Or from before your changes
git checkout HEAD~3 -- <file>
```

## Safety Checks

### Before Any Hard Reset

```bash
# 1. Check for uncommitted changes
git status

# 2. Stash them first
git stash push -m "safety: before hard reset"

# 3. Then do the reset
git reset --hard <target>
```

### Before Discarding Work

```bash
# Always stash instead of discard when unsure
git stash push -m "maybe-discard: [description]"

# You can always drop it later
git stash drop stash@{0}
```

## Recovery from Mistakes

### Accidentally Dropped Stash

```bash
# Find lost stashes (within ~30 days)
git fsck --unreachable | grep commit

# Or check reflog
git reflog
```

### Accidentally Reset Wrong Commit

```bash
# Find the commit you want
git reflog

# Reset back to it
git reset --hard <commit-from-reflog>
```

## Beads Integration

After rolling back, update beads:

```bash
# Reopen issue if needed
bd update <id> --status=open

# Add note explaining rollback
bd update <id> --add-note="Rolled back: [reason]. Starting fresh approach."

# Sync state
bd sync
```

## Best Practices

1. **Stash before discard**: Always safer
2. **Check git status first**: Know what you're affecting
3. **Use soft reset**: Keep changes for review
4. **Update beads**: Document why you rolled back
5. **Branch for experiments**: Easy to discard entire branch
