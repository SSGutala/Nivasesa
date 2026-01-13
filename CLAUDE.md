# Nivasesa - Claude Code Context

## Project Overview

Nivasesa is a Next.js 15 Turborepo monorepo connecting South Asian home seekers with culturally-aligned realtors, roommates, and room listings across Texas, New Jersey, and California.

**Tech Stack:** Next.js 15, TypeScript, Prisma (SQLite dev / PostgreSQL prod), NextAuth, Tailwind CSS, Lucide icons

**Key Features:**
- Realtor matching by language and location
- Roommate profiles with lifestyle compatibility
- Room listings with Freedom Score system
- Groups for coordinated housing search
- Lead management for realtors

## Project Structure

```
apps/
  rent-app/            # Peer-to-peer housing (NVS-R01)
    app/               # Next.js App Router pages
    actions/           # Server actions
    components/        # App-specific components
    lib/               # App utilities
    prisma/            # Database schema
  lead-gen/            # Realtor matching platform (future)

packages/
  ui/                  # @niv/ui - Shared React components
  auth/                # @niv/auth - NextAuth + 2FA
  types/               # @niv/types - Shared TypeScript types
  config/              # @niv/config - ESLint, TypeScript configs

.claude/               # Claude Code configuration
  agents/              # 115+ subagents in 10 categories
    _beads-integration.md  # Beads workflow documentation
    01-core-development/   # Full-stack specialists
    02-language-specialists/ # Language experts
    04-quality-security/   # Testing & review (code-reviewer here)
    09-meta-orchestration/ # Coordination (branch-coordinator here)
  hooks/               # Pre/post tool hooks
  skills/              # Custom skills (beads, multi-session)
  settings.json        # Team-shared settings

scripts/               # Utility scripts
  spawn-agent.sh       # Spawn agent on branch
  list-agents.sh       # List running agents
  stop-agents.sh       # Stop agents

docker/                # Docker configurations
  docker-compose.dev.yml    # Single dev container
  docker-compose.agents.yml # Multi-agent containers
  Dockerfile.agent          # Agent container image
docs/                  # Documentation
```

## Environment Modes

- `LAUNCHED=true` - Full platform with all features
- `LAUNCHED=false` - Pre-launch mode with survey/waitlist only

---

## AI-Powered Workflow

### Gas Town Orchestration (Primary)

Nivasesa uses [Gas Town](https://github.com/steveyegge/gastown) for multi-agent coordination.

**HQ Location:** `~/gt`
**Rig:** `nivasesa` (at `~/gt/nivasesa/`)

```bash
# Quick Start
cd ~/gt/nivasesa/crew/aditya     # Your workspace
gt prime                          # Load context

# Spawn polecats (workers)
gt sling NVS-123                  # Assign issue to a polecat
gt polecat list                   # See workers

# Monitor
gt status                         # Town overview
gt convoy list                    # Work batches
gt feed                           # Real-time activity

# Mayor (high-level coordination)
gt mayor attach                   # Enter coordinator mode
```

**Architecture:**
```
~/gt (HQ)
├── mayor/               # Town-level coordinator
├── nivasesa/            # Rig (this project)
│   ├── crew/aditya/     # Your workspace
│   ├── refinery/rig/    # Merge queue processor
│   ├── witness/         # Monitors polecats
│   └── polecats/        # Worker agents
└── .beads/              # Town-level issue tracking
```

See [Gas Town docs](https://github.com/steveyegge/gastown/tree/main/docs) for full reference.

### Available Subagents

115+ agents organized in [`.claude/agents/`](.claude/agents/README.md). Key agents:

| Agent | Category | Purpose | Beads Role |
|-------|----------|---------|------------|
| `workflow-orchestrator` | meta-orchestration | Orchestrate complex workflows | Creates tasks |
| `branch-coordinator` | meta-orchestration | Parallel branch-based work | Spawns agents |
| `task-distributor` | meta-orchestration | Distribute and track tasks | Assigns work |
| `code-reviewer` | quality-security | Review and approve code | **Closes beads** |
| `test-automator` | quality-security | Automated testing | Reports results |
| `error-detective` | quality-security | Debug and fix errors | Tracks fixes |
| `nextjs-developer` | language-specialists | Next.js implementation | - |
| `typescript-pro` | language-specialists | TypeScript expertise | - |

**Full catalog**: See [`.claude/agents/README.md`](.claude/agents/README.md) for all 10 categories.

### Available Skills

Skills are auto-invoked when relevant:

| Skill | Purpose |
|-------|---------|
| `beads` | Issue tracking with bd commands |
| `crew` | **Team coordination with task trees** |
| `multi-session` | Parallel agent coordination |
| `checkpoint` | Save progress state for recovery |
| `rollback` | Undo changes and restore previous state |
| `security-review` | Security vulnerability checks |
| `pr-review` | Pull request review standards |

### Automated Hooks

These run automatically:

| Hook | Trigger | Action |
|------|---------|--------|
| `block-sensitive-files` | Before Write/Edit | Blocks .env, secrets, node_modules |
| `post-edit-security` | After Write/Edit | Scans for secrets, eval, XSS |
| `schema-change-alert` | After schema Edit | Reminds to run prisma commands |
| `pre-commit-check` | Before git commit | Runs typecheck and tests |

### Security Workflow

1. **During Development**: Hooks auto-scan after each edit
2. **Before Commit**: Run `npm run security-check`
3. **Before Deploy**: Use security-auditor subagent
4. **PR Review**: Use pr-review skill

### Dangerous Mode (Autonomous)

For extended autonomous sessions without permission prompts:

```bash
# Option 1: Use script (with safety checks)
./scripts/claude-dangerous.sh

# Option 2: Docker (safest)
./scripts/claude-dangerous.sh --docker

# Option 3: Add alias to ~/.zshrc
alias clauded='claude --dangerously-skip-permissions'
```

See `docs/DANGEROUS-MODE.md` for full guide.

### Multi-Session Development

Two approaches for parallel work:

| Approach | Isolation | Best For |
|----------|-----------|----------|
| **Same Branch** | File ownership | Quick parallel work |
| **Branch per Agent** | Full git isolation | Feature development |

See [`.claude/skills/multi-session/SKILL.md`](.claude/skills/multi-session/SKILL.md) for patterns.

### Branch-Based Agent Containers (Recommended)

Spawn agents on separate branches in isolated Docker containers:

```bash
# Spawn agents on different branches
./scripts/spawn-agent.sh feature/auth agent-1
./scripts/spawn-agent.sh feature/search agent-2

# List running agents
./scripts/list-agents.sh

# Attach to an agent
docker attach nivasesa-agent-1

# Stop all agents
./scripts/stop-agents.sh
```

**Workflow:**
```
┌─────────────────────────────────────────────────────────┐
│              BRANCH-COORDINATOR                         │
│  Plans branches, spawns agents, merges results          │
└─────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   agent-1       │  │   agent-2       │  │   agent-3       │
│ feature/auth    │  │ feature/search  │  │ feature/tests   │
│ bead: NVS-001   │  │ bead: NVS-002   │  │ bead: NVS-003   │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         └────────────────────┼────────────────────┘
                              ▼
                         main (merged)
```

**Related files:**
- Agent: [`.claude/agents/09-meta-orchestration/branch-coordinator.md`](.claude/agents/09-meta-orchestration/branch-coordinator.md)
- Docker: [`docker/docker-compose.agents.yml`](docker/docker-compose.agents.yml)
- Scripts: [`scripts/spawn-agent.sh`](scripts/spawn-agent.sh), [`scripts/list-agents.sh`](scripts/list-agents.sh)

### Subagent Workflow (Compaction-Resistant)

For complex tasks, use the coordinator pattern to avoid context compaction:

```
USER: Add favorites feature

COORDINATOR (stays lean):
├── Spawn Explorer: "How do listings work?"
│   ← "Prisma model at schema.prisma, ListingCard at components/"
├── Spawn Implementer: "Add Favorite model + action"
│   ← "Created actions/favorites.ts, updated schema"
├── Spawn Implementer: "Add heart icon to ListingCard"
│   ← "Updated ListingCard.tsx"
├── Spawn Tester: "Write favorites tests"
│   ← "8 tests, all pass"
└── Spawn Reviewer: "Check all changes"
    ← "Approved"
```

**Key Principle**: Coordinator NEVER reads files or writes code. All work delegated to subagents with fresh 200k context each.

See `.claude/skills/subagent-workflow/SKILL.md` for full patterns.

### Docker Development

Two Docker configurations:

| Config | Purpose | Use Case |
|--------|---------|----------|
| `docker-compose.dev.yml` | Single dev container | Dangerous mode sandbox |
| `docker-compose.agents.yml` | Multi-agent containers | Parallel branch work |

```bash
# Single container (dangerous mode)
docker-compose -f docker/docker-compose.dev.yml up -d
docker exec -it nivasesa-dev claude --dangerously-skip-permissions

# Multi-agent (branch isolation)
./scripts/spawn-agent.sh feature/auth agent-1
./scripts/spawn-agent.sh feature/api agent-2
```

See [`docker/`](docker/) for all configurations.

---

## Task Management

### Gas Town + Beads (Recommended)

```bash
# Session Start (in ~/gt/nivasesa/crew/aditya)
gt prime                              # Load Gas Town context
bd ready                              # Available work

# Working
gt sling <issue>                      # Assign to polecat worker
gt hook                               # What's on my hook?
gt convoy create "Feature X" <ids>    # Group related issues

# Session End
gt done                               # Signal work ready
bd sync && git push
```

### Beads Only (Simple)
```bash
bd prime              # Start of session
bd ready              # Show available work
bd show <id>          # Issue details
bd update <id> --status=in_progress
bd close <id>         # Mark complete
bd sync               # End of session
```

### TodoWrite (Single-Session)
Use for breaking down current task into steps.

---

## Code Standards

### TypeScript
- Strict mode compliance
- Explicit return types
- No `any` without justification

### React/Next.js
- Server Components by default
- 'use client' only when necessary
- Server actions in `actions/`

### Database
- Use `lib/prisma.ts` client
- Always handle not-found
- Use `include` to avoid N+1

### Security
- Input validation at boundaries
- No hardcoded secrets
- Auth checks via middleware

---

## Security Review Checklist

### Input Validation
- [ ] User inputs validated server-side
- [ ] No dangerouslySetInnerHTML with user data

### Authentication & Authorization
- [ ] Protected routes check session in middleware
- [ ] Role-based access enforced (BUYER, REALTOR, ADMIN)

### Data Exposure
- [ ] API responses don't leak passwords/tokens
- [ ] Error messages don't expose internals

### Secrets
- [ ] No hardcoded API keys
- [ ] Secrets in env vars only

---

## Demo Accounts

All use any password (demo mode):
- `raj.patel@example.com` - Realtor (Frisco, TX)
- `priya.sharma@example.com` - Realtor (Dallas, TX)
- `suresh.reddy@example.com` - Realtor (Irving, TX)
- `anita.desai@example.com` - Realtor (Jersey City, NJ)

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run security-check   # Run security scan
npx prisma studio        # Database GUI

# Database
npx prisma generate      # Generate client
npx prisma db push       # Push schema changes

# Gas Town (Multi-Agent)
gt status                # Town overview
gt sling <issue>         # Assign work to polecat
gt convoy list           # View work batches
gt feed                  # Real-time activity
gt mayor attach          # Enter coordinator mode

# Issue Tracking (Beads)
bd ready                 # Show available work
bd close <id>            # Mark complete
bd sync                  # Sync with git
```

---

## Files Requiring Extra Review

These files need careful review before modification:

| File | Reason |
|------|--------|
| `.env` / `.env.*` | Contains secrets |
| `prisma/schema.prisma` | Database schema |
| `middleware.ts` | Route protection |
| `auth.ts` | Auth configuration |
| `lib/permissions.ts` | RBAC logic |

---

## Session Protocol

### Start (Gas Town)
```bash
cd ~/gt/nivasesa/crew/aditya
gt prime
bd ready
```

### Start (Simple)
```bash
bd prime
```

### End
```bash
git status
git add <files>
bd sync
git commit -m "..."
bd sync
git push
```

---

## Troubleshooting

### Build Fails

| Error | Solution |
|-------|----------|
| TypeScript errors | Run `npx tsc --noEmit` to see details |
| Missing 'use client' | Add directive to components using hooks/browser APIs |
| Import not found | Check path aliases in `tsconfig.json` |
| Module not found | Run `npm install` or check package.json |

### Prisma Issues

| Error | Solution |
|-------|----------|
| Schema out of sync | Run `npx prisma generate` |
| DB mismatch | Run `npx prisma db push` |
| Migration failed | Check schema syntax, run `npx prisma format` |
| Client not generated | Run `npx prisma generate` after schema changes |

### NextAuth Issues

| Error | Solution |
|-------|----------|
| Session undefined | Check middleware.ts route matching |
| Callback errors | Verify callback URLs in auth config |
| Token missing data | Check jwt/session callbacks in auth.ts |

### Context Compaction

**Signs**: Agent forgets earlier context, asks repeated questions, loses track of task

**Fix**:
1. End current session
2. Run `bd sync` to save state
3. Start fresh with `bd prime`
4. Use coordinator pattern for complex tasks

### Common Fixes

```bash
# Reset everything
rm -rf node_modules && npm install
npx prisma generate
npm run build

# Clear Next.js cache
rm -rf .next

# Reset database (dev only!)
rm prisma/dev.db && npx prisma db push
```

---

## File Ownership

### By Application

| Path | Owner | Description |
|------|-------|-------------|
| `apps/rent-app/*` | rent-app | Peer-to-peer housing platform |
| `apps/lead-gen/*` | lead-gen | Realtor matching platform |
| `packages/ui/*` | shared | UI components - changes affect all apps |
| `packages/auth/*` | shared | Auth logic - security critical |
| `packages/types/*` | shared | TypeScript types |

### By Service

| Path | Owner | Description |
|------|-------|-------------|
| `services/gateway/*` | backend | Apollo Federation gateway |
| `services/listing-service/*` | backend | Listings subgraph |
| `services/user-service/*` | backend | Users subgraph |

### Critical Files

| File | Impact | Review Required |
|------|--------|-----------------|
| `prisma/schema.prisma` | Database structure | Always |
| `middleware.ts` | Route protection | Security review |
| `auth.ts` | Authentication | Security review |
| `lib/permissions.ts` | Authorization | Security review |
| `.env*` | Secrets | Never commit |

### Parallel Work Guidelines

When running multiple Claude sessions:

| Session | Owns | Avoids |
|---------|------|--------|
| Session A | `app/feature-a/*` | `app/feature-b/*` |
| Session B | `app/feature-b/*` | `app/feature-a/*` |
| Both | - | `packages/*`, `prisma/*` (coordinate via git) |
