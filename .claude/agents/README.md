# Claude Code Subagents

125+ specialized AI agents organized into 10 categories. Run them in Docker containers with beads for parallel development.

> **Quick Links:**
> - [Multi-Session Workflow](../skills/multi-session/SKILL.md) - **Start here for parallel agents**
> - [CLAUDE.md](../../CLAUDE.md) - Project documentation
> - [Beads Integration](./_beads-integration.md) - Task tracking workflow

## The Workflow

```bash
# 1. Create beads for the work
bd create --title="[Rust] Backend services"
bd create --title="[TypeScript] API types"

# 2. Spawn specialized agents in containers
./scripts/spawn-agent.sh feature/backend agent-rust
./scripts/spawn-agent.sh feature/api agent-ts

# 3. Attach and direct each agent
docker attach nivasesa-agent-rust
> bd prime
> Finish all beads related to backend. Use rust-engineer patterns.

# 4. Merge when done
git merge feature/backend feature/api
```

## Categories

| Category | Count | Description |
|----------|-------|-------------|
| [01-core-development](./01-core-development/) | 10 | Full-stack development specialists |
| [02-language-specialists](./02-language-specialists/) | 26 | Language and framework experts |
| [03-infrastructure](./03-infrastructure/) | 14 | Cloud, DevOps, platform engineering |
| [04-quality-security](./04-quality-security/) | 12 | Testing, review, and security specialists |
| [05-data-ai](./05-data-ai/) | 12 | Data engineering and AI/ML |
| [06-developer-experience](./06-developer-experience/) | 13 | Tooling and workflow optimization |
| [07-specialized-domains](./07-specialized-domains/) | 12 | Industry-specific specialists |
| [08-business-product](./08-business-product/) | 11 | Business and product specialists |
| [09-meta-orchestration](./09-meta-orchestration/) | 10 | Multi-agent coordination |
| [10-research-analysis](./10-research-analysis/) | 6 | Research and analysis |

## Key Agents

### Orchestration & Coordination

| Agent | Purpose | Docs |
|-------|---------|------|
| [crew-coordinator](./09-meta-orchestration/crew-coordinator.md) | **Coordinate agent teams** | Epic trees, crew management |
| [branch-coordinator](./09-meta-orchestration/branch-coordinator.md) | Parallel branch-based work | Spawns container agents |
| [workflow-orchestrator](./09-meta-orchestration/workflow-orchestrator.md) | Orchestrate complex workflows | Creates beads, delegates |
| [task-distributor](./09-meta-orchestration/task-distributor.md) | Distribute and track tasks | Assigns work via beads |

### Quality & Review

| Agent | Purpose | Docs |
|-------|---------|------|
| [code-reviewer](./04-quality-security/code-reviewer.md) | Review and approve code | **Closes beads** |
| [test-automator](./04-quality-security/test-automator.md) | Automated testing | Reports results |
| [error-detective](./04-quality-security/error-detective.md) | Debug and fix errors | Tracks fixes |

## Beads Integration

Key agents include beads workflow for persistent task tracking:

```bash
bd ready                    # View available tasks
bd update <id> --status=in_progress  # Claim work
bd update <id> --add-note="..."      # Add progress
bd close <id> --reason="..."         # Complete (reviewer only)
bd sync                              # Persist state
```

See [_beads-integration.md](./_beads-integration.md) for full workflow documentation.

### Beads Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Orchestrator   │────▶│   Implementer   │────▶│    Reviewer     │
│  bd create      │     │   bd update     │     │   bd close      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Branch-Based Agent Workflow

For parallel development, spawn agents on separate branches:

```bash
# Spawn agents
./scripts/spawn-agent.sh feature/auth agent-1
./scripts/spawn-agent.sh feature/api agent-2

# Monitor
./scripts/list-agents.sh

# Stop
./scripts/stop-agents.sh
```

See [branch-coordinator](./09-meta-orchestration/branch-coordinator.md) for full workflow.

**Related:**
- [CLAUDE.md - Branch-Based Workflow](../../CLAUDE.md#branch-based-agent-containers-recommended)
- [Multi-Session Skill](../skills/multi-session/SKILL.md)
- [Docker Compose](../../docker/docker-compose.agents.yml)

## Usage

Agents are invoked via the Task tool:

```
Use the [agent-name] to [task description]
```

Examples:
- "Use the branch-coordinator to set up parallel feature work"
- "Use the workflow-orchestrator to implement the favorites feature"
- "Use the nextjs-developer to add server-side rendering"
- "Use the code-reviewer to review the authentication flow"

## Source

Agents sourced from [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents).
