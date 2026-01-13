#!/bin/bash
# List all running agent containers and their branches
#
# Usage: ./scripts/list-agents.sh

echo "🤖 Running Agents"
echo "================="
echo ""

docker ps --filter "name=nivasesa-agent" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No agents running"

echo ""
echo "Agent Details:"
echo "--------------"

for container in $(docker ps --filter "name=nivasesa-agent" --format "{{.Names}}" 2>/dev/null); do
    branch=$(docker exec "$container" git branch --show-current 2>/dev/null || echo "unknown")
    echo "  $container: branch/$branch"
done
