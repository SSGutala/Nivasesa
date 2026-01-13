#!/bin/bash

# Production Deployment Script for Nivasesa
# This script deploys applications to AWS Amplify

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    print_warning "jq is not installed. Some features may not work."
    JQ_AVAILABLE=false
else
    JQ_AVAILABLE=true
fi

print_info "Nivasesa Production Deployment"
echo ""

# Get deployment target
echo "Which application would you like to deploy?"
echo "1) Rent App"
echo "2) Lead Gen App"
echo "3) Both"
read -p "Enter choice [1-3]: " APP_CHOICE

# Get Amplify App IDs
if [ "$APP_CHOICE" = "1" ] || [ "$APP_CHOICE" = "3" ]; then
    read -p "Enter Rent App Amplify App ID: " RENT_APP_ID
    if [ -z "$RENT_APP_ID" ]; then
        print_error "Rent App ID is required"
        exit 1
    fi
fi

if [ "$APP_CHOICE" = "2" ] || [ "$APP_CHOICE" = "3" ]; then
    read -p "Enter Lead Gen App Amplify App ID: " LEAD_GEN_APP_ID
    if [ -z "$LEAD_GEN_APP_ID" ]; then
        print_error "Lead Gen App ID is required"
        exit 1
    fi
fi

# Get branch to deploy
read -p "Branch to deploy [main]: " BRANCH
BRANCH=${BRANCH:-main}

# Get environment
read -p "Environment (production/staging) [production]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-production}

# Confirmation
echo ""
print_warning "Deployment Summary:"
if [ "$APP_CHOICE" = "1" ]; then
    echo "  Application: Rent App"
    echo "  App ID: $RENT_APP_ID"
elif [ "$APP_CHOICE" = "2" ]; then
    echo "  Application: Lead Gen App"
    echo "  App ID: $LEAD_GEN_APP_ID"
else
    echo "  Applications: Both (Rent App + Lead Gen)"
    echo "  Rent App ID: $RENT_APP_ID"
    echo "  Lead Gen App ID: $LEAD_GEN_APP_ID"
fi
echo "  Branch: $BRANCH"
echo "  Environment: $ENVIRONMENT"
echo ""

read -p "Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    print_info "Deployment cancelled"
    exit 0
fi

# Function to deploy an Amplify app
deploy_app() {
    local APP_ID=$1
    local APP_NAME=$2

    print_step "Deploying $APP_NAME..."

    # Check if app exists
    if ! aws amplify get-app --app-id "$APP_ID" &> /dev/null; then
        print_error "Amplify app $APP_ID not found"
        return 1
    fi

    # Start deployment
    print_info "Triggering build for $APP_NAME..."
    JOB_ID=$(aws amplify start-job \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH" \
        --job-type RELEASE \
        --query 'jobSummary.jobId' \
        --output text)

    if [ -z "$JOB_ID" ]; then
        print_error "Failed to start deployment for $APP_NAME"
        return 1
    fi

    print_info "Build started with Job ID: $JOB_ID"
    print_info "Monitoring build progress..."

    # Monitor build status
    while true; do
        STATUS=$(aws amplify get-job \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH" \
            --job-id "$JOB_ID" \
            --query 'job.summary.status' \
            --output text)

        case $STATUS in
            PENDING)
                echo -n "."
                ;;
            RUNNING)
                echo -n "+"
                ;;
            SUCCEED)
                echo ""
                print_info "$APP_NAME deployed successfully!"
                return 0
                ;;
            FAILED)
                echo ""
                print_error "$APP_NAME deployment failed!"
                print_info "Check Amplify Console for details:"
                print_info "https://console.aws.amazon.com/amplify/home?region=$(aws configure get region)#/$APP_ID/$BRANCH/$JOB_ID"
                return 1
                ;;
            CANCELLED)
                echo ""
                print_warning "$APP_NAME deployment was cancelled"
                return 1
                ;;
        esac

        sleep 10
    done
}

# Pre-deployment checks
print_step "Running pre-deployment checks..."

# Check if branch exists
print_info "Verifying branch '$BRANCH' exists..."
git fetch origin
if ! git rev-parse --verify "origin/$BRANCH" &> /dev/null; then
    print_error "Branch '$BRANCH' does not exist on remote"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 0
    fi
fi

# Run tests
print_info "Running tests..."
if ! pnpm run test:run; then
    print_error "Tests failed"
    read -p "Continue with deployment anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 0
    fi
fi

# Run type check
print_info "Running type check..."
if ! pnpm run typecheck; then
    print_error "Type check failed"
    read -p "Continue with deployment anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 0
    fi
fi

# Deploy applications
echo ""
print_step "Starting deployment..."

if [ "$APP_CHOICE" = "1" ]; then
    deploy_app "$RENT_APP_ID" "Rent App"
    DEPLOY_STATUS=$?
elif [ "$APP_CHOICE" = "2" ]; then
    deploy_app "$LEAD_GEN_APP_ID" "Lead Gen App"
    DEPLOY_STATUS=$?
else
    # Deploy both
    deploy_app "$RENT_APP_ID" "Rent App"
    RENT_STATUS=$?

    echo ""
    deploy_app "$LEAD_GEN_APP_ID" "Lead Gen App"
    LEAD_STATUS=$?

    if [ $RENT_STATUS -eq 0 ] && [ $LEAD_STATUS -eq 0 ]; then
        DEPLOY_STATUS=0
    else
        DEPLOY_STATUS=1
    fi
fi

# Post-deployment
echo ""
if [ $DEPLOY_STATUS -eq 0 ]; then
    print_info "Deployment completed successfully!"

    # Get app URLs
    if [ "$APP_CHOICE" = "1" ] || [ "$APP_CHOICE" = "3" ]; then
        RENT_APP_URL=$(aws amplify get-app --app-id "$RENT_APP_ID" --query 'app.defaultDomain' --output text 2>/dev/null || echo "")
        if [ -n "$RENT_APP_URL" ]; then
            print_info "Rent App URL: https://$BRANCH.$RENT_APP_URL"
        fi
    fi

    if [ "$APP_CHOICE" = "2" ] || [ "$APP_CHOICE" = "3" ]; then
        LEAD_GEN_URL=$(aws amplify get-app --app-id "$LEAD_GEN_APP_ID" --query 'app.defaultDomain' --output text 2>/dev/null || echo "")
        if [ -n "$LEAD_GEN_URL" ]; then
            print_info "Lead Gen App URL: https://$BRANCH.$LEAD_GEN_URL"
        fi
    fi

    echo ""
    print_info "Post-deployment checklist:"
    echo "  1. Verify applications are accessible"
    echo "  2. Check CloudWatch logs for errors"
    echo "  3. Test critical user flows"
    echo "  4. Monitor error rates in CloudWatch"
    echo "  5. Verify database migrations completed"

else
    print_error "Deployment failed!"
    echo ""
    print_info "Troubleshooting steps:"
    echo "  1. Check Amplify Console for build logs"
    echo "  2. Verify environment variables are set correctly"
    echo "  3. Check database connectivity"
    echo "  4. Review CloudWatch logs"
    exit 1
fi

# Save deployment record
echo ""
print_info "Saving deployment record..."
mkdir -p .deployment-history
cat > ".deployment-history/deploy-$(date +%Y%m%d-%H%M%S).log" << EOF
Deployment Date: $(date)
Environment: $ENVIRONMENT
Branch: $BRANCH
Deployed By: $(git config user.name)
Commit: $(git rev-parse HEAD)
Applications: $([ "$APP_CHOICE" = "1" ] && echo "Rent App" || [ "$APP_CHOICE" = "2" ] && echo "Lead Gen App" || echo "Both")
Status: $([ $DEPLOY_STATUS -eq 0 ] && echo "Success" || echo "Failed")
EOF

print_info "Deployment complete!"
