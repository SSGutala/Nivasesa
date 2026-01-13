#!/bin/bash

# AWS Setup Script for Nivasesa
# This script helps set up the AWS infrastructure for Nivasesa

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if Terraform is installed (if using Terraform approach)
if ! command -v terraform &> /dev/null; then
    print_warning "Terraform is not installed. Skipping Terraform setup."
    TERRAFORM_AVAILABLE=false
else
    TERRAFORM_AVAILABLE=true
fi

print_info "AWS Setup for Nivasesa"
echo ""

# Get AWS account details
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
if [ -z "$AWS_ACCOUNT_ID" ]; then
    print_error "Unable to get AWS account ID. Please configure AWS CLI first."
    echo "Run: aws configure"
    exit 1
fi

print_info "AWS Account ID: $AWS_ACCOUNT_ID"
print_info "AWS Region: $(aws configure get region)"
echo ""

# Ask user which approach to use
echo "Which infrastructure approach would you like to use?"
echo "1) CloudFormation (AWS native)"
echo "2) Terraform (recommended for multi-cloud)"
read -p "Enter choice [1-2]: " APPROACH

if [ "$APPROACH" = "2" ] && [ "$TERRAFORM_AVAILABLE" = false ]; then
    print_error "Terraform is not installed. Please install it or choose CloudFormation."
    exit 1
fi

# Get environment
read -p "Environment (production/staging) [production]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-production}

# Get domain information
read -p "Rent App Domain [nivasesa.com]: " RENT_APP_DOMAIN
RENT_APP_DOMAIN=${RENT_APP_DOMAIN:-nivasesa.com}

read -p "Lead Gen Domain [leads.nivasesa.com]: " LEAD_GEN_DOMAIN
LEAD_GEN_DOMAIN=${LEAD_GEN_DOMAIN:-leads.nivasesa.com}

read -p "Admin Email: " ADMIN_EMAIL
if [ -z "$ADMIN_EMAIL" ]; then
    print_error "Admin email is required"
    exit 1
fi

# Generate database password
print_info "Generating secure database password..."
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

echo ""
print_info "Configuration Summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Rent App Domain: $RENT_APP_DOMAIN"
echo "  Lead Gen Domain: $LEAD_GEN_DOMAIN"
echo "  Admin Email: $ADMIN_EMAIL"
echo ""

read -p "Continue with this configuration? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    print_info "Setup cancelled"
    exit 0
fi

# Step 1: Create SSL Certificate (ACM)
print_info "Step 1: Creating SSL certificates in ACM (us-east-1 for CloudFront)..."
echo "NOTE: You need to validate domain ownership via email or DNS"
echo "Opening AWS Console for ACM certificate creation..."
echo ""
echo "Create certificates for:"
echo "  - $RENT_APP_DOMAIN and *.$RENT_APP_DOMAIN"
echo "  - $LEAD_GEN_DOMAIN"
echo ""
read -p "Press Enter when certificates are created and validated..."

# Get certificate ARN
read -p "Enter ACM Certificate ARN (from us-east-1): " ACM_CERT_ARN
if [ -z "$ACM_CERT_ARN" ]; then
    print_error "Certificate ARN is required"
    exit 1
fi

if [ "$APPROACH" = "1" ]; then
    # CloudFormation Approach
    print_info "Using CloudFormation approach..."

    # Step 2: Create VPC (if needed)
    print_info "Step 2: Setting up VPC..."
    DEFAULT_VPC=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

    if [ "$DEFAULT_VPC" = "None" ] || [ -z "$DEFAULT_VPC" ]; then
        print_warning "No default VPC found. You need to create a VPC manually or use a custom VPC."
        read -p "Enter VPC ID: " VPC_ID
    else
        print_info "Found default VPC: $DEFAULT_VPC"
        read -p "Use default VPC? (y/n): " USE_DEFAULT
        if [ "$USE_DEFAULT" = "y" ]; then
            VPC_ID=$DEFAULT_VPC
        else
            read -p "Enter VPC ID: " VPC_ID
        fi
    fi

    # Get subnets
    print_info "Getting subnets for VPC: $VPC_ID"
    SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text)
    SUBNET_ARRAY=($SUBNETS)

    if [ ${#SUBNET_ARRAY[@]} -lt 2 ]; then
        print_error "Need at least 2 subnets in different AZs for RDS"
        exit 1
    fi

    SUBNET1=${SUBNET_ARRAY[0]}
    SUBNET2=${SUBNET_ARRAY[1]}

    # Step 3: Deploy Database Stack
    print_info "Step 3: Deploying database stack..."
    aws cloudformation create-stack \
        --stack-name "${ENVIRONMENT}-nivasesa-database" \
        --template-body file://infrastructure/cloudformation/database.yml \
        --parameters \
            ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
            ParameterKey=VPCId,ParameterValue=$VPC_ID \
            ParameterKey=PrivateSubnet1,ParameterValue=$SUBNET1 \
            ParameterKey=PrivateSubnet2,ParameterValue=$SUBNET2 \
            ParameterKey=MasterUsername,ParameterValue=nivasesaadmin \
            ParameterKey=MasterPassword,ParameterValue=$DB_PASSWORD \
        --capabilities CAPABILITY_IAM

    print_info "Waiting for database stack to complete (this may take 10-15 minutes)..."
    aws cloudformation wait stack-create-complete --stack-name "${ENVIRONMENT}-nivasesa-database"
    print_info "Database stack created successfully!"

    # Step 4: Deploy Storage Stack
    print_info "Step 4: Deploying storage stack..."
    aws cloudformation create-stack \
        --stack-name "${ENVIRONMENT}-nivasesa-storage" \
        --template-body file://infrastructure/cloudformation/storage.yml \
        --parameters \
            ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
            ParameterKey=RentAppDomain,ParameterValue=$RENT_APP_DOMAIN \
            ParameterKey=LeadGenDomain,ParameterValue=$LEAD_GEN_DOMAIN \
            ParameterKey=ACMCertificateArn,ParameterValue=$ACM_CERT_ARN

    print_info "Waiting for storage stack to complete..."
    aws cloudformation wait stack-create-complete --stack-name "${ENVIRONMENT}-nivasesa-storage"
    print_info "Storage stack created successfully!"

    # Step 5: Deploy Email Stack
    print_info "Step 5: Deploying email stack..."
    aws cloudformation create-stack \
        --stack-name "${ENVIRONMENT}-nivasesa-email" \
        --template-body file://infrastructure/cloudformation/email.yml \
        --parameters \
            ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
            ParameterKey=RentAppDomain,ParameterValue=$RENT_APP_DOMAIN \
            ParameterKey=LeadGenDomain,ParameterValue=$LEAD_GEN_DOMAIN \
            ParameterKey=AdminEmail,ParameterValue=$ADMIN_EMAIL \
        --capabilities CAPABILITY_IAM

    print_info "Waiting for email stack to complete..."
    aws cloudformation wait stack-create-complete --stack-name "${ENVIRONMENT}-nivasesa-email"
    print_info "Email stack created successfully!"

    # Get outputs
    print_info "Retrieving stack outputs..."
    RENT_APP_DB=$(aws cloudformation describe-stacks --stack-name "${ENVIRONMENT}-nivasesa-database" --query "Stacks[0].Outputs[?OutputKey=='RentAppDBConnectionString'].OutputValue" --output text)
    LEAD_GEN_DB=$(aws cloudformation describe-stacks --stack-name "${ENVIRONMENT}-nivasesa-database" --query "Stacks[0].Outputs[?OutputKey=='LeadGenDBConnectionString'].OutputValue" --output text)
    RENT_APP_BUCKET=$(aws cloudformation describe-stacks --stack-name "${ENVIRONMENT}-nivasesa-storage" --query "Stacks[0].Outputs[?OutputKey=='RentAppAssetsBucketName'].OutputValue" --output text)
    LEAD_GEN_BUCKET=$(aws cloudformation describe-stacks --stack-name "${ENVIRONMENT}-nivasesa-storage" --query "Stacks[0].Outputs[?OutputKey=='LeadGenAssetsBucketName'].OutputValue" --output text)

else
    # Terraform Approach
    print_info "Using Terraform approach..."

    cd infrastructure/terraform

    # Create terraform.tfvars if it doesn't exist
    if [ ! -f terraform.tfvars ]; then
        print_info "Creating terraform.tfvars from example..."
        cp terraform.tfvars.example terraform.tfvars

        # Update values
        sed -i.bak "s/environment = .*/environment = \"$ENVIRONMENT\"/" terraform.tfvars
        sed -i.bak "s/rent_app_domain = .*/rent_app_domain = \"$RENT_APP_DOMAIN\"/" terraform.tfvars
        sed -i.bak "s/lead_gen_domain = .*/lead_gen_domain = \"$LEAD_GEN_DOMAIN\"/" terraform.tfvars
        sed -i.bak "s/admin_email = .*/admin_email = \"$ADMIN_EMAIL\"/" terraform.tfvars
        sed -i.bak "s|acm_certificate_arn = .*|acm_certificate_arn = \"$ACM_CERT_ARN\"|" terraform.tfvars
        sed -i.bak "s/db_master_password = .*/db_master_password = \"$DB_PASSWORD\"/" terraform.tfvars
        rm terraform.tfvars.bak
    fi

    print_info "Initializing Terraform..."
    terraform init

    print_info "Planning Terraform changes..."
    terraform plan

    read -p "Apply Terraform changes? (y/n): " APPLY_TF
    if [ "$APPLY_TF" = "y" ]; then
        terraform apply -auto-approve
        print_info "Terraform infrastructure created successfully!"
    fi

    cd ../..
fi

# Step 6: Set up Amplify Apps
print_info "Step 6: Setting up AWS Amplify apps..."
echo ""
echo "To complete setup, you need to:"
echo "1. Go to AWS Amplify Console"
echo "2. Create two new apps:"
echo "   a) Rent App - connected to your GitHub repository"
echo "   b) Lead Gen App - connected to your GitHub repository"
echo "3. Use the build specifications from:"
echo "   - infrastructure/amplify-rent-app.yml"
echo "   - infrastructure/amplify-lead-gen.yml"
echo "4. Configure environment variables in Amplify Console"
echo ""
print_info "See docs/AWS_DEPLOYMENT.md for detailed instructions"

# Save configuration
print_info "Saving configuration..."
cat > .aws-setup-config << EOF
ENVIRONMENT=$ENVIRONMENT
RENT_APP_DOMAIN=$RENT_APP_DOMAIN
LEAD_GEN_DOMAIN=$LEAD_GEN_DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL
AWS_REGION=$(aws configure get region)
SETUP_DATE=$(date)
EOF

print_info "Setup complete!"
echo ""
print_info "IMPORTANT: Save these credentials securely!"
echo ""
echo "Database Password: $DB_PASSWORD"
echo ""
print_info "Next steps:"
echo "1. Set up DNS records (see docs/AWS_DEPLOYMENT.md)"
echo "2. Verify SES email addresses"
echo "3. Configure Amplify apps"
echo "4. Set environment variables in Amplify"
echo "5. Deploy applications"
