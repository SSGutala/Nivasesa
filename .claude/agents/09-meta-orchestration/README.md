# Meta & Orchestration Agents

Multi-agent coordination and workflow management specialists.

> **Related:**
> - [CLAUDE.md - AI-Powered Workflow](../../../CLAUDE.md#ai-powered-workflow)
> - [Multi-Session Skill](../../skills/multi-session/SKILL.md)
> - [Beads Integration](../_beads-integration.md)

## Key Orchestration Agents

| Agent | Focus | Beads |
|-------|-------|-------|
| [crew-coordinator](./crew-coordinator.md) | **Team coordination** | Epic → Story → Task trees |
| [branch-coordinator](./branch-coordinator.md) | Parallel branch work | Spawns agents |
| [workflow-orchestrator](./workflow-orchestrator.md) | Complex workflows | Creates tasks |
| [task-distributor](./task-distributor.md) | Task allocation | Assigns work |

## All Agents

| Agent | Focus |
|-------|-------|
| crew-coordinator | **Coordinate agent teams with task trees** |
| branch-coordinator | Branch-based parallel work |
| workflow-orchestrator | Complex workflows |
| task-distributor | Task allocation |
| agent-organizer | Multi-agent coordination |
| multi-agent-coordinator | Advanced orchestration |
| context-manager | Context optimization |
| knowledge-synthesizer | Knowledge aggregation |
| error-coordinator | Error recovery |
| performance-monitor | Agent performance |
| it-ops-orchestrator | IT operations |

## Branch-Based Workflow

The **branch-coordinator** enables parallel development:

```bash
# Spawn agents on separate branches
./scripts/spawn-agent.sh feature/auth agent-1
./scripts/spawn-agent.sh feature/api agent-2

# List running agents
./scripts/list-agents.sh

# Stop all
./scripts/stop-agents.sh
```

**Workflow:**
```
BRANCH-COORDINATOR
├── agent-1 (feature/auth, bead: NVS-001)
├── agent-2 (feature/api, bead: NVS-002)
└── agent-3 (feature/tests, bead: NVS-003)
         ↓
    main (merged)
```

See [branch-coordinator.md](./branch-coordinator.md) for full documentation.

## Beads Integration

Orchestration agents use beads for task tracking:

```bash
# Orchestrator creates tasks
bd create --title="Feature X" --type=task

# Delegates to implementers
bd update <id> --status=in_progress

# Reviewer closes on approval
bd close <id> --reason="Approved"
```

**Important**: Orchestrators create and delegate tasks. Only `code-reviewer` closes beads.

## When to Use

- **workflow-orchestrator**: Complex multi-step features
- **branch-coordinator**: Parallel work requiring git isolation
- **task-distributor**: Load balancing across agents
- **multi-agent-coordinator**: Large-scale agent coordination
- **error-coordinator**: Handling failures across agents

## Related Files

- [Docker Compose](../../../docker/docker-compose.agents.yml) - Agent containers
- [Spawn Script](../../../scripts/spawn-agent.sh) - Agent spawning
- [Multi-Session Skill](../../skills/multi-session/SKILL.md) - Workflow patterns
