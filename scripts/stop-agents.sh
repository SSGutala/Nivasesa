#!/bin/bash
# Stop all or specific agent containers
#
# Usage:
#   ./scripts/stop-agents.sh          # Stop all
#   ./scripts/stop-agents.sh agent-1  # Stop specific

if [ -n "$1" ]; then
    echo "🛑 Stopping agent: $1"
    docker stop "nivasesa-$1" 2>/dev/null || echo "Agent not running: $1"
else
    echo "🛑 Stopping all agents..."
    docker ps --filter "name=nivasesa-agent" --format "{{.Names}}" | xargs -r docker stop
fi

echo "✅ Done"
