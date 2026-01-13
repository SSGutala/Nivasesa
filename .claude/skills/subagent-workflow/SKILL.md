# Subagent Workflow - Compaction-Resistant Architecture

## The Problem

Single-agent sessions suffer from context compaction:
1. Agent reads files → context fills
2. Agent writes code → more context
3. Context summarized → details lost
4. Agent forgets critical information

## The Solution

**Coordinator never does work.** All work delegated to subagents with fresh context.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COORDINATOR (This Agent)                         │
│                                                                     │
│  Context contains ONLY:                                             │
│  • Task queue (1-liners)                                            │
│  • Subagent summaries (1-paragraph each)                            │
│  • Beads issue IDs                                                  │
│                                                                     │
│  NEVER contains:                                                    │
│  • File contents                                                    │
│  • Code blocks                                                      │
│  • Long explanations                                                │
│  • Debug traces                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌───────────┐         ┌─────────┐
   │Explorer │          │Implementer│         │ Tester  │
   │(haiku)  │          │ (sonnet)  │         │(sonnet) │
   │         │          │           │         │         │
   │ Fresh   │          │  Fresh    │         │  Fresh  │
   │ context │          │  context  │         │  context│
   │ 200k    │          │  200k     │         │  200k   │
   └────┬────┘          └─────┬─────┘         └────┬────┘
        │                     │                    │
        ▼                     ▼                    ▼
   "Found 3 files       "Created             "All 12 tests
    at paths X,Y,Z.      FeatureX.tsx.        pass. Build
    Pattern is ABC."     Updated 2 files."    succeeds."
```

## Agent Roster

| Agent | Model | Purpose | Tools |
|-------|-------|---------|-------|
| coordinator | opus | Orchestrate only | Bash (bd commands) |
| explorer | haiku | Find files, understand patterns | Read, Grep, Glob |
| implementer | sonnet | Write and edit code | Read, Write, Edit, Bash |
| tester | sonnet | Write tests, verify | Read, Write, Bash |
| reviewer | sonnet | Quality check (read-only) | Read, Grep, Glob |
| debugger | sonnet | Fix errors | Read, Edit, Bash |

## Concurrency Limits

- **Max parallel subagents**: 10
- **Recommended**: 3-5 (diminishing returns, file conflicts)
- **Model choice**: haiku for exploration, sonnet for implementation

## Workflow Patterns

### Pattern 1: Research → Implement → Test → Review

Sequential pipeline when tasks depend on each other:

```
Step 1: Coordinator spawns Explorer
        → "Research how auth works in the codebase"
        ← "Auth uses NextAuth v5 at lib/auth.ts, session in middleware.ts"

Step 2: Coordinator spawns Implementer
        → "Add logout button to Header. Follow pattern in lib/auth.ts"
        ← "Created LogoutButton at components/LogoutButton.tsx"

Step 3: Coordinator spawns Tester
        → "Write tests for LogoutButton component"
        ← "Added 5 tests, all passing"

Step 4: Coordinator spawns Reviewer
        → "Review LogoutButton.tsx and tests"
        ← "Approved. No issues found."
```

### Pattern 2: Parallel Fan-Out

When tasks are independent:

```
Coordinator analyzes: "Add CRUD for 3 entities: Users, Posts, Comments"

Spawn simultaneously:
├── Implementer 1: "Create User CRUD at actions/users.ts"
├── Implementer 2: "Create Post CRUD at actions/posts.ts"
└── Implementer 3: "Create Comment CRUD at actions/comments.ts"

Wait for all 3 → aggregate results

Then spawn Tester: "Write tests for all three CRUD modules"
```

### Pattern 3: Explore → Plan → Parallel Implement

For large features:

```
Step 1: Explorer
        → "Map all files related to listings feature"
        ← "Found: app/listing/*, actions/listing.ts, components/ListingCard.tsx"

Step 2: Coordinator creates beads tasks from findings

Step 3: Parallel Implementers (one per file/area)
        → Each takes one beads task
        ← Each closes their beads task

Step 4: Single Tester for integration tests

Step 5: Single Reviewer for final check
```

### Pattern 4: Debug Loop

When builds fail:

```
Step 1: Coordinator runs: npm run build
        → Captures error output

Step 2: Spawn Debugger
        → "Fix this build error: [error message]"
        ← "Fixed: Missing import at line 42"

Step 3: Coordinator runs: npm run build again
        → If fails, back to Step 2
        → If passes, continue with tests
```

## Beads Integration

Beads provides persistence across sessions. Subagents update beads:

```bash
# Coordinator at session start
bd ready                    # See what's available

# Coordinator creates task breakdown
bd create --title="Research auth patterns" --type=task
bd create --title="Implement logout button" --type=task
bd create --title="Write logout tests" --type=task

# Intermediate subagents (explorer, implementer, tester) - progress notes only
bd update <issue-id> --add-note="Completed: [1-sentence summary]"

# ONLY the final subagent (reviewer) closes the bead
bd close <issue-id> --reason="[Approved/Rejected]: [1-sentence summary]"

# Coordinator at session end
bd sync
```

## Bead Closure Policy

**CRITICAL**: Only the LAST subagent in a workflow may close a bead.

| Agent | Can Close Beads? | Action |
|-------|------------------|--------|
| Explorer | ❌ No | `bd update --add-note` |
| Implementer | ❌ No | `bd update --add-note` |
| Tester | ❌ No | `bd update --add-note` |
| Debugger | ❌ No | `bd update --add-note` |
| **Reviewer** | ✅ Yes | `bd close --reason` |

**Why?** Closing a bead signals "work complete." If an implementer closes after coding but before testing/review, the bead incorrectly shows as done even if:
- Tests fail
- Reviewer requests changes
- Build breaks

**Exception**: If no reviewer step is needed (e.g., pure research task), the coordinator may close the bead after the final subagent completes.

## Subagent Prompt Templates

### Explorer Prompt
```
Research the codebase to answer: [QUESTION]

Look in: [DIRECTORIES or "entire codebase"]

Return format:
1. Answer (1-2 paragraphs max)
2. Key files found (paths only)
3. Pattern to follow (if applicable)

Do NOT make any changes. Read-only.
```

### Implementer Prompt
```
Implement: [FEATURE DESCRIPTION]

Files to create/modify: [PATHS]
Reference pattern in: [EXISTING FILE]
Beads issue: [ISSUE-ID]

Requirements:
- [REQUIREMENT 1]
- [REQUIREMENT 2]

When done:
1. Run: npm run build
2. Run: bd update [ISSUE-ID] --add-note="Implemented: [summary]"
3. Return: List of files changed + 1-sentence summary

NOTE: Do NOT close the bead. Only the final reviewer closes beads.
```

### Tester Prompt
```
Write tests for: [FEATURE/FILES]

Test file location: __tests__/[PATH]
Beads issue: [ISSUE-ID]

Cover:
- [SCENARIO 1]
- [SCENARIO 2]
- [EDGE CASE]

When done:
1. Run: npm run test:run
2. Run: bd update [ISSUE-ID] --add-note="Tests: [X tests, all passing]"
3. Return: Test count + pass/fail status

NOTE: Do NOT close the bead. Only the final reviewer closes beads.
```

### Reviewer Prompt
```
Review these files for quality and security:
- [FILE 1]
- [FILE 2]

Beads issue: [ISSUE-ID]

Check:
- Follows existing patterns
- No security issues
- TypeScript strict compliant
- Proper error handling

When done:
1. If APPROVED: bd close [ISSUE-ID] --reason="Approved: [summary]"
2. If CHANGES REQUESTED: bd update [ISSUE-ID] --add-note="Review: Changes requested - [issues]"

Return format:
- Critical issues (must fix)
- Warnings (should fix)
- Verdict: APPROVED or CHANGES REQUESTED

NOTE: As the final agent, you are responsible for closing the bead on approval.
```

### Debugger Prompt
```
Debug this error:

```
[ERROR MESSAGE]
```

Context: [WHAT WAS HAPPENING]

1. Find root cause
2. Implement fix
3. Verify with: npm run build

Return: Problem + Solution (2 sentences max)
```

## Anti-Patterns

### ❌ Coordinator reads files
```
# BAD - fills coordinator context
Coordinator: Let me read the auth file to understand...
[Reads 500 lines of code]
```

```
# GOOD - delegate to explorer
Coordinator: Spawning explorer to understand auth patterns
Explorer: "Auth uses NextAuth v5, config at auth.ts, session check in middleware"
```

### ❌ Coordinator writes code
```
# BAD - fills context with code
Coordinator: Let me implement this feature...
[Writes 200 lines of React]
```

```
# GOOD - delegate to implementer
Coordinator: Spawning implementer for feature X
Implementer: "Created FeatureX.tsx, updated index.ts"
```

### ❌ Coordinator debugs
```
# BAD - fills context with debug info
Coordinator: Build failed, let me check the error...
[Reads error, reads file, tries fix, repeat]
```

```
# GOOD - delegate to debugger
Coordinator: Build failed. Spawning debugger with error message.
Debugger: "Fixed: Missing await on line 42"
```

### ❌ Long subagent summaries
```
# BAD - verbose summary fills coordinator context
Implementer returns: "I created a new component called FeatureX which handles
the user authentication flow. The component uses the useAuth hook that I found
in the existing codebase. It renders a form with email and password fields..."
[500 words]
```

```
# GOOD - terse summary preserves context
Implementer returns: "Created components/FeatureX.tsx (auth form). Updated
Header.tsx to include it. Build passes."
```

## Session Example

```
USER: Add a favorites feature to listings

COORDINATOR:
1. Creating beads tasks:
   - bd create "Research listings data model" → Nivasesa-abc
   - bd create "Add favorites to schema" → Nivasesa-def
   - bd create "Create toggle favorite action" → Nivasesa-ghi
   - bd create "Add heart icon to ListingCard" → Nivasesa-jkl
   - bd create "Write favorites tests" → Nivasesa-mno

2. Spawning Explorer for Nivasesa-abc...
   ← "Listings use Prisma model at prisma/schema.prisma. ListingCard at
      components/ListingCard.tsx. No existing favorites."
   → bd update Nivasesa-abc --add-note="Research complete"

3. Spawning Implementer for Nivasesa-def...
   ← "Added Favorite model to schema. Ran prisma generate."
   → bd update Nivasesa-def --add-note="Implemented: schema updated"

4. Spawning Implementer for Nivasesa-ghi...
   ← "Created actions/favorites.ts with toggleFavorite action."
   → bd update Nivasesa-ghi --add-note="Implemented: action created"

5. Spawning Implementer for Nivasesa-jkl...
   ← "Added FavoriteButton to ListingCard. Build passes."
   → bd update Nivasesa-jkl --add-note="Implemented: UI complete"

6. Spawning Tester for Nivasesa-mno...
   ← "8 tests added, all passing."
   → bd update Nivasesa-mno --add-note="Tests: 8 passing"

7. Spawning Reviewer (FINAL AGENT)...
   ← "Approved. No issues."
   → bd close Nivasesa-abc --reason="Approved: research complete"
   → bd close Nivasesa-def --reason="Approved: schema updated"
   → bd close Nivasesa-ghi --reason="Approved: action implemented"
   → bd close Nivasesa-jkl --reason="Approved: UI complete"
   → bd close Nivasesa-mno --reason="Approved: tests passing"

STATUS:
- All 5 tasks complete (closed by reviewer)
- bd sync done
- Ready for commit
```

## Quick Reference

| When... | Spawn... |
|---------|----------|
| Need to find something | Explorer (haiku) |
| Need to understand patterns | Explorer (haiku) |
| Need to write code | Implementer (sonnet) |
| Need to write tests | Tester (sonnet) |
| Need to verify quality | Reviewer (sonnet) |
| Build/tests fail | Debugger (sonnet) |
| Multiple independent tasks | Parallel Implementers |
