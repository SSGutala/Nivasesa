---
name: crew
description: Coordinate a crew of specialized agents working as a team on complex features. Use for multi-agent parallel development with hierarchical task trees.
allowed-tools: Bash, Read
---

# Crew Coordination Skill

Orchestrate a team of specialized agents working on hierarchical task trees.

## The Crew Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    CREW COORDINATOR (You)                   │
│  Creates epic → breaks into stories → assigns to agents     │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌───────────┐   ┌───────────┐   ┌───────────┐
       │  Agent 1  │   │  Agent 2  │   │  Agent 3  │
       │  Backend  │   │  Frontend │   │   Tests   │
       │           │   │           │   │           │
       │ ├─ Task 1 │   │ ├─ Task 4 │   │ ├─ Task 7 │
       │ ├─ Task 2 │   │ ├─ Task 5 │   │ ├─ Task 8 │
       │ └─ Task 3 │   │ └─ Task 6 │   │ └─ Task 9 │
       └───────────┘   └───────────┘   └───────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                         main branch
```

## Step 1: Create the Epic Tree

### Epic → Stories → Tasks

```bash
# Create the epic (top-level feature)
bd create --title="[EPIC] User Authentication System" --type=epic --priority=1

# Create stories under the epic (use naming convention)
bd create --title="[AUTH/backend] API endpoints" --type=feature --priority=1
bd create --title="[AUTH/frontend] Login UI" --type=feature --priority=1
bd create --title="[AUTH/tests] Test coverage" --type=feature --priority=2

# Create tasks under each story
# Backend tasks
bd create --title="[AUTH/backend] POST /auth/login" --type=task --priority=1
bd create --title="[AUTH/backend] POST /auth/register" --type=task --priority=1
bd create --title="[AUTH/backend] POST /auth/logout" --type=task --priority=1
bd create --title="[AUTH/backend] Session middleware" --type=task --priority=1

# Frontend tasks
bd create --title="[AUTH/frontend] LoginForm component" --type=task --priority=1
bd create --title="[AUTH/frontend] RegisterForm component" --type=task --priority=1
bd create --title="[AUTH/frontend] AuthContext provider" --type=task --priority=1

# Test tasks
bd create --title="[AUTH/tests] API endpoint tests" --type=task --priority=2
bd create --title="[AUTH/tests] Component tests" --type=task --priority=2
bd create --title="[AUTH/tests] E2E login flow" --type=task --priority=2
```

### Set Dependencies

```bash
# Frontend depends on backend API
bd dep add <login-form-id> <post-login-id>
bd dep add <register-form-id> <post-register-id>

# Tests depend on implementation
bd dep add <api-tests-id> <backend-story-id>
bd dep add <component-tests-id> <frontend-story-id>
bd dep add <e2e-tests-id> <frontend-story-id>
```

## Step 2: Spawn the Crew

### Create Branches

```bash
git checkout main
git checkout -b feature/auth-backend
git push -u origin feature/auth-backend

git checkout main
git checkout -b feature/auth-frontend
git push -u origin feature/auth-frontend

git checkout main
git checkout -b feature/auth-tests
git push -u origin feature/auth-tests
```

### Spawn Specialized Agents

```bash
# Backend specialist
./scripts/spawn-agent.sh feature/auth-backend crew-backend

# Frontend specialist
./scripts/spawn-agent.sh feature/auth-frontend crew-frontend

# Test specialist (waits for others)
./scripts/spawn-agent.sh feature/auth-tests crew-tests
```

## Step 3: Direct Each Agent

### Agent 1: Backend Specialist

```bash
docker attach nivasesa-crew-backend
```

```
bd prime
bd list | grep "AUTH/backend"

Complete all tasks prefixed with [AUTH/backend]:
- Use backend-developer or the appropriate language specialist
- Each task should be a separate commit
- Update beads after each task: bd update <id> --add-note="Done: [summary]"
- Do NOT close beads - coordinator will close after review
```

### Agent 2: Frontend Specialist

```bash
docker attach nivasesa-crew-frontend
```

```
bd prime
bd list | grep "AUTH/frontend"

Complete all tasks prefixed with [AUTH/frontend]:
- Use react-specialist or frontend-developer patterns
- Wait if blocked by backend (bd blocked will show)
- Each component should be a separate commit
- Update beads after each task
```

### Agent 3: Test Specialist

```bash
docker attach nivasesa-crew-tests
```

```
bd prime
bd list | grep "AUTH/tests"

Complete all tasks prefixed with [AUTH/tests]:
- Use test-automator patterns
- Wait for dependencies (bd blocked will show blockers)
- Write comprehensive tests
- Update beads with test results
```

## Step 4: Monitor & Coordinate

### Check Crew Status

```bash
# From your main terminal
./scripts/list-agents.sh

# Check beads progress
bd list | grep AUTH
bd stats

# Check specific agent
docker exec nivasesa-crew-backend bd list --status=in_progress
```

### Handle Blockers

```bash
# If an agent is blocked, check dependencies
bd blocked

# Unblock by completing dependencies or removing them
bd dep remove <blocked-id> <blocker-id>
```

## Step 5: Review & Merge

### Review Each Branch

```bash
# Review backend
git checkout feature/auth-backend
git log --oneline
# Run tests locally

# Review frontend
git checkout feature/auth-frontend
git log --oneline

# Review tests
git checkout feature/auth-tests
git log --oneline
```

### Merge in Order

```bash
git checkout main

# Merge backend first (no dependencies)
git merge feature/auth-backend
bd close <backend-task-ids> --reason="Merged to main"

# Merge frontend (depends on backend)
git merge feature/auth-frontend
bd close <frontend-task-ids> --reason="Merged to main"

# Merge tests last
git merge feature/auth-tests
bd close <test-task-ids> --reason="Merged to main"

# Close the stories
bd close <backend-story-id> <frontend-story-id> <tests-story-id>

# Close the epic
bd close <epic-id> --reason="Authentication system complete"

# Sync
bd sync
git push
```

## Step 6: Cleanup

```bash
# Stop all crew agents
./scripts/stop-agents.sh

# Delete feature branches
git branch -d feature/auth-backend feature/auth-frontend feature/auth-tests
git push origin --delete feature/auth-backend feature/auth-frontend feature/auth-tests
```

---

## Task Tree Naming Convention

Use hierarchical prefixes to create visual trees:

```
[EPIC] User Authentication           # Epic (top level)
├── [AUTH/backend] API endpoints     # Story
│   ├── [AUTH/backend] POST /login   # Task
│   ├── [AUTH/backend] POST /register
│   └── [AUTH/backend] Session middleware
├── [AUTH/frontend] Login UI         # Story
│   ├── [AUTH/frontend] LoginForm
│   └── [AUTH/frontend] AuthContext
└── [AUTH/tests] Test coverage       # Story
    ├── [AUTH/tests] API tests
    └── [AUTH/tests] E2E tests
```

### Prefix Pattern

```
[EPIC] Name                    # Top-level feature
[FEATURE/area] Name            # Story under feature
[FEATURE/area] Specific task   # Task under story
```

### Filtering by Area

```bash
bd list | grep "AUTH"           # All auth-related
bd list | grep "AUTH/backend"   # Backend tasks only
bd list | grep "AUTH/frontend"  # Frontend tasks only
```

---

## Crew Roles

| Role | Agent | Responsibility |
|------|-------|----------------|
| Coordinator | You | Create epic tree, assign work, merge |
| Backend | backend-developer, rust-engineer, etc. | API, services, data |
| Frontend | frontend-developer, react-specialist | UI, components |
| Tests | test-automator | Test coverage |
| DevOps | devops-engineer | CI/CD, deployment |
| Reviewer | code-reviewer | Final approval |

---

## Related

- [Multi-Session Skill](../multi-session/SKILL.md) - Base patterns
- [Beads Skill](../beads/SKILL.md) - Issue tracking
- [Branch Coordinator](../../agents/09-meta-orchestration/branch-coordinator.md)
