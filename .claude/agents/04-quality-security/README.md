# Quality & Security Agents

Code quality, testing, and security specialists.

## Quality Assurance
| Agent | Focus | Beads |
|-------|-------|-------|
| code-reviewer | Code review, final approval | Closes beads |
| qa-expert | Testing strategies | - |
| test-automator | Automated testing | Reports results |
| accessibility-tester | A11y compliance | - |
| performance-engineer | Performance optimization | - |
| chaos-engineer | Resilience testing | - |
| architect-reviewer | Architecture review | - |
| error-detective | Error investigation, debugging | Tracks fixes |

## Security
| Agent | Focus |
|-------|-------|
| compliance-auditor | Regulatory compliance |
| penetration-tester | Security testing |
| ad-security-reviewer | Active Directory security |
| powershell-security-hardening | PowerShell security |

## Beads Workflow

The **code-reviewer** is the final quality gate and closes beads on approval:

```bash
# On approval
bd close <id> --reason="Approved: [summary]"

# On changes requested
bd update <id> --add-note="Review: Changes requested - [issues]"
```

## When to Use

- Before deploying to production
- After major code changes
- During security audits
- For performance optimization
- Investigating production errors
