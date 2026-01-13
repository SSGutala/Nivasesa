# Beads Integration for Agents

This file documents the beads issue tracking workflow that agents should follow.

> **Related:**
> - [CLAUDE.md - Task Management](../../CLAUDE.md#task-management)
> - [Beads Skill](../skills/beads/SKILL.md) - Full beads documentation
> - [Agents with Beads](./README.md#agents-with-beads-support) - Which agents use beads

## Beads Commands

```bash
# View available work
bd ready              # Show tasks ready to be worked on
bd list               # Show all issues
bd show <id>          # Show issue details

# Claim and track work
bd update <id> --status=in_progress    # Claim a task
bd update <id> --add-note="[progress]" # Add progress notes

# Create new tasks (for subtasks discovered during work)
bd create --title="[task]" --type=task --priority=1

# Complete work
bd close <id> --reason="[summary]"     # Mark complete (reviewer only)
bd sync                                 # Sync state at end of session
```

## Agent Responsibilities

| Role | Beads Actions |
|------|---------------|
| Coordinator/Orchestrator | `bd create`, `bd ready`, delegates closure to reviewer |
| Implementer/Developer | `bd update --status`, `bd update --add-note`, never closes |
| Tester | `bd update --add-note` with test results, never closes |
| Reviewer | `bd close` on approval, `bd update --add-note` if changes needed |
| Debugger | `bd update --add-note` with fix details, never closes |

## Workflow Pattern

```
1. Orchestrator: bd create --title="Feature X"
2. Implementer:  bd update <id> --status=in_progress
3. Implementer:  bd update <id> --add-note="Implemented: [summary]"
4. Tester:       bd update <id> --add-note="Tests: 8/8 passing"
5. Reviewer:     bd close <id> --reason="Approved: [summary]"
6. All:          bd sync
```

## Key Rules

1. **Only reviewers close beads** - Ensures work is reviewed before completion
2. **Always add notes** - Creates audit trail of progress
3. **Sync at session end** - Persists state across sessions
4. **Create subtasks** - When discovering additional work during implementation

## Agents with Beads Integration

| Agent | Location | Beads Role |
|-------|----------|------------|
| [workflow-orchestrator](./09-meta-orchestration/workflow-orchestrator.md) | meta-orchestration | Creates tasks |
| [branch-coordinator](./09-meta-orchestration/branch-coordinator.md) | meta-orchestration | Coordinates parallel beads |
| [task-distributor](./09-meta-orchestration/task-distributor.md) | meta-orchestration | Distributes tasks |
| [code-reviewer](./04-quality-security/code-reviewer.md) | quality-security | **Closes beads** |
| [test-automator](./04-quality-security/test-automator.md) | quality-security | Reports test results |
| [error-detective](./04-quality-security/error-detective.md) | quality-security | Tracks fixes |

## Branch-Based Beads

When using [branch-coordinator](./09-meta-orchestration/branch-coordinator.md), each agent gets its own bead:

```bash
# Coordinator creates beads for each branch
bd create --title="[agent-1] Feature UI" --type=task
bd create --title="[agent-2] Feature API" --type=task

# Each agent updates its own bead
bd update <id> --add-note="Branch: feature/ui"

# Close after merge
bd close <id> --reason="Merged to main"
```
