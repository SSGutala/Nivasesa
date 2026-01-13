---
name: multi-session
description: Coordinate multiple parallel Claude sessions for complex work. Use when planning parallel workstreams or managing concurrent development tasks.
allowed-tools: Bash, Read
---

# Multi-Session Claude Workflow

Run specialized agents in Docker containers to work on different parts of your codebase.

> **Recommended**: Use [Gas Town](https://github.com/steveyegge/gastown) for production multi-agent coordination.
> Gas Town HQ: `~/gt` | Nivasesa rig: `~/gt/nivasesa/`
>
> ```bash
> # Quick start with Gas Town
> cd ~/gt/nivasesa/crew/aditya
> gt prime && bd ready
> gt sling <issue>     # Assign to polecat worker
> gt status            # Monitor progress
> ```

## The Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    YOU (Coordinator)                    │
│         Plan work → Assign beads → Merge results        │
└─────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Container 1   │  │   Container 2   │  │   Container 3   │
│  rust-engineer  │  │ typescript-pro  │  │frontend-developer│
│                 │  │                 │  │                 │
│ beads: backend  │  │ beads: api      │  │ beads: ui       │
│ services        │  │ types           │  │ components      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Quick Start

### 1. Create Beads for the Work

```bash
# Create related sets of tasks
bd create --title="Backend services (Rust)" --type=task
bd create --title="API types (TypeScript)" --type=task
bd create --title="UI components (React)" --type=task
bd sync
```

### 2. Spawn Specialized Agents

```bash
# Each agent works on its branch with its beads
./scripts/spawn-agent.sh feature/backend agent-rust
./scripts/spawn-agent.sh feature/api agent-ts
./scripts/spawn-agent.sh feature/ui agent-frontend
```

### 3. Attach and Direct Each Agent

**Terminal 1 - Rust Backend:**
```bash
docker attach nivasesa-agent-rust
> bd prime
> Finish all beads related to backend services. Use rust-engineer patterns.
```

**Terminal 2 - TypeScript API:**
```bash
docker attach nivasesa-agent-ts
> bd prime
> Finish all beads related to API types. Use typescript-pro patterns.
```

**Terminal 3 - React Frontend:**
```bash
docker attach nivasesa-agent-frontend
> bd prime
> Finish all beads related to UI components. Use react-specialist patterns.
```

### 4. Monitor and Merge

```bash
# Check progress
./scripts/list-agents.sh
bd list

# When done, merge branches
git checkout main
git merge feature/backend
git merge feature/api
git merge feature/ui

# Stop containers
./scripts/stop-agents.sh
```

---

## Specialized Agent Examples

### By Language

| Agent | Use For | Beads Pattern |
|-------|---------|---------------|
| `rust-engineer` | Systems code, performance | "Rust services", "FFI bindings" |
| `typescript-pro` | Type definitions, Node.js | "API types", "Shared types" |
| `python-pro` | Scripts, ML code | "Data pipeline", "ML models" |
| `golang-pro` | Microservices, CLI tools | "Service X", "CLI commands" |

### By Domain

| Agent | Use For | Beads Pattern |
|-------|---------|---------------|
| `frontend-developer` | React/Vue/Angular | "UI components", "Pages" |
| `backend-developer` | APIs, services | "Endpoints", "Business logic" |
| `database-optimizer` | SQL, Prisma | "Schema changes", "Queries" |
| `devops-engineer` | CI/CD, infra | "Pipeline", "Deployment" |

---

## Docker Commands

```bash
# Spawn agent on branch
./scripts/spawn-agent.sh <branch> <agent-id>

# List running agents
./scripts/list-agents.sh

# Attach to agent (interactive)
docker attach nivasesa-<agent-id>

# Detach without stopping: Ctrl+P, Ctrl+Q

# Run single command
docker exec nivasesa-<agent-id> bd list

# View logs
docker logs -f nivasesa-<agent-id>

# Stop specific agent
./scripts/stop-agents.sh <agent-id>

# Stop all agents
./scripts/stop-agents.sh
```

---

## Beads Patterns

### Pattern 1: By Language/Tech

```bash
bd create --title="[Rust] Service implementation"
bd create --title="[TypeScript] Type definitions"
bd create --title="[React] UI components"
```

### Pattern 2: By Feature Area

```bash
bd create --title="[Auth] Login flow - backend"
bd create --title="[Auth] Login flow - frontend"
bd create --title="[Auth] Login flow - tests"
```

### Pattern 3: By Layer

```bash
bd create --title="[DB] Schema changes"
bd create --title="[API] Endpoint handlers"
bd create --title="[UI] Form components"
```

---

## Workflow Tips

1. **Plan beads first** - Create all beads before spawning agents
2. **Group related beads** - Use prefixes like `[Rust]`, `[API]`, `[UI]`
3. **One branch per agent** - Prevents merge conflicts
4. **Use dangerous mode** - Agents run autonomously in containers
5. **Check progress** - `bd list` shows status across all beads
6. **Merge frequently** - Don't let branches diverge too long

---

## Crew Workflow (Advanced)

For complex features requiring coordinated teams, see [Crew Skill](../crew/SKILL.md).

```bash
# 1. Create epic tree
bd create --title="[EPIC] Auth System" --type=epic
bd create --title="[AUTH/backend] API" --type=feature
bd create --title="[AUTH/frontend] UI" --type=feature
bd create --title="[AUTH/tests] Tests" --type=feature

# 2. Spawn crew
./scripts/spawn-agent.sh feature/auth-backend crew-backend
./scripts/spawn-agent.sh feature/auth-frontend crew-frontend
./scripts/spawn-agent.sh feature/auth-tests crew-tests

# 3. Direct each agent to their area
# crew-backend: bd list | grep "AUTH/backend"
# crew-frontend: bd list | grep "AUTH/frontend"
# crew-tests: bd list | grep "AUTH/tests"

# 4. Merge & close tree bottom-up
```

---

## Related

- [Crew Skill](../crew/SKILL.md) - **Team coordination with task trees**
- [Crew Coordinator Agent](../../agents/09-meta-orchestration/crew-coordinator.md)
- [Branch Coordinator Agent](../../agents/09-meta-orchestration/branch-coordinator.md)
- [Language Specialists](../../agents/02-language-specialists/)
- [Docker Compose](../../../docker/docker-compose.agents.yml)
- [CLAUDE.md](../../../CLAUDE.md#branch-based-agent-containers-recommended)
