#!/bin/bash
# Spawn a Claude agent on a specific branch in a container
#
# Usage:
#   ./scripts/spawn-agent.sh <branch> <agent-id> [repo-url]
#
# Examples:
#   ./scripts/spawn-agent.sh feature-auth agent-1
#   ./scripts/spawn-agent.sh feature-search agent-2
#   ./scripts/spawn-agent.sh main agent-3 git@github.com:org/repo.git

set -e

BRANCH=${1:-main}
AGENT_ID=${2:-agent-1}
REPO_URL=${3:-$(git remote get-url origin 2>/dev/null || echo "https://github.com/your-org/nivasesa.git")}

echo "🚀 Spawning agent..."
echo "   Agent ID: $AGENT_ID"
echo "   Branch:   $BRANCH"
echo "   Repo:     $REPO_URL"
echo ""

# Export for docker-compose
export BRANCH
export AGENT_ID
export REPO_URL

# Start the container
docker-compose -f docker/docker-compose.agents.yml up -d

echo ""
echo "✅ Agent container started: nivasesa-$AGENT_ID"
echo ""
echo "To attach to the agent:"
echo "   docker attach nivasesa-$AGENT_ID"
echo ""
echo "To run commands:"
echo "   docker exec -it nivasesa-$AGENT_ID bash"
echo ""
echo "To view logs:"
echo "   docker logs -f nivasesa-$AGENT_ID"
echo ""
echo "To stop:"
echo "   docker stop nivasesa-$AGENT_ID"
