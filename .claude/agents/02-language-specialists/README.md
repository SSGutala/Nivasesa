# Language Specialist Agents

Deep expertise in specific programming languages and frameworks.

> **Related:**
> - [Multi-Session Workflow](../../skills/multi-session/SKILL.md) - Run specialists in parallel
> - [Docker Compose](../../../docker/docker-compose.agents.yml) - Container setup

## Quick Usage

```bash
# Spawn a language specialist in a container
./scripts/spawn-agent.sh feature/api agent-ts

# Attach and direct it
docker attach nivasesa-agent-ts
> bd prime
> Finish all TypeScript-related beads. Use typescript-pro patterns.
```

## Web Frameworks

| Agent | Stack | Use For |
|-------|-------|---------|
| nextjs-developer | Next.js, React, TypeScript | Full-stack Next.js apps |
| react-specialist | React ecosystem | React components, hooks |
| vue-expert | Vue.js 3, Composition API | Vue applications |
| angular-architect | Angular, RxJS | Angular enterprise apps |
| django-developer | Django, Python | Python web backends |
| rails-expert | Ruby on Rails | Rails applications |
| laravel-specialist | Laravel, PHP | PHP web applications |
| spring-boot-engineer | Spring Boot, Java | Java microservices |

## Languages

| Agent | Language | Use For |
|-------|----------|---------|
| typescript-pro | TypeScript | Type definitions, strict typing |
| javascript-pro | JavaScript, Node.js | Node.js services, scripts |
| python-pro | Python | Scripts, ML, data processing |
| golang-pro | Go | Microservices, CLI tools |
| rust-engineer | Rust | Systems code, performance |
| java-architect | Java, JVM | Enterprise Java |
| csharp-developer | C#, .NET | .NET applications |
| cpp-pro | C++ | Performance-critical code |
| php-pro | PHP | PHP web development |
| swift-expert | Swift | iOS/macOS apps |
| kotlin-specialist | Kotlin | Android, JVM |
| elixir-expert | Elixir | Functional, concurrent |
| sql-pro | SQL | Database queries, optimization |

## .NET Specific

| Agent | Stack |
|-------|-------|
| dotnet-core-expert | .NET Core, cross-platform |
| dotnet-framework-4.8-expert | .NET Framework legacy |

## PowerShell

| Agent | Focus |
|-------|-------|
| powershell-5.1-expert | Windows PowerShell |
| powershell-7-expert | PowerShell 7+ cross-platform |

## Mobile

| Agent | Platform |
|-------|----------|
| flutter-expert | Flutter, Dart |

## Parallel Workflow Example

For a full-stack feature with multiple languages:

```bash
# Create beads by language
bd create --title="[Rust] Backend service"
bd create --title="[TypeScript] API client types"
bd create --title="[React] UI components"

# Spawn specialists
./scripts/spawn-agent.sh feature/backend agent-rust
./scripts/spawn-agent.sh feature/types agent-ts
./scripts/spawn-agent.sh feature/ui agent-react

# Direct each one
# Terminal 1: docker attach nivasesa-agent-rust
# Terminal 2: docker attach nivasesa-agent-ts
# Terminal 3: docker attach nivasesa-agent-react

# Merge when all complete
git checkout main
git merge feature/backend feature/types feature/ui
```
