#!/bin/bash
# Agent entrypoint - clones repo and checks out branch

set -e

BRANCH=${BRANCH:-main}
AGENT_ID=${AGENT_ID:-agent-1}
REPO_URL=${REPO_URL:-https://github.com/your-org/nivasesa.git}

echo "🤖 Agent $AGENT_ID starting..."
echo "📦 Branch: $BRANCH"

# Clone if workspace is empty
if [ ! -d "/workspace/.git" ]; then
    echo "📥 Cloning repository..."
    git clone --branch "$BRANCH" "$REPO_URL" /workspace 2>/dev/null || \
    git clone "$REPO_URL" /workspace
    cd /workspace
    git checkout -B "$BRANCH" origin/"$BRANCH" 2>/dev/null || \
    git checkout -b "$BRANCH"
else
    echo "📂 Workspace exists, updating..."
    cd /workspace
    git fetch origin
    git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH"
    git pull origin "$BRANCH" 2>/dev/null || true
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci 2>/dev/null || npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Initialize beads
echo "📋 Initializing beads..."
bd prime 2>/dev/null || echo "Beads not available"

echo "✅ Agent $AGENT_ID ready on branch $BRANCH"
echo "================================================"
echo ""

# Execute the command (claude by default)
exec "$@"
