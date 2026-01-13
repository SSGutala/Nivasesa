# AWS Deployment Guide

Complete guide for deploying Nivasesa to AWS infrastructure.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Infrastructure Deployment](#infrastructure-deployment)
- [Application Deployment](#application-deployment)
- [DNS Configuration](#dns-configuration)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)
- [Cost Estimation](#cost-estimation)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Route 53                            │
│                    (DNS Management)                         │
└────────────────┬────────────────────────┬───────────────────┘
                 │                        │
                 │                        │
        ┌────────▼─────────┐    ┌────────▼─────────┐
        │   CloudFront     │    │   CloudFront     │
        │   (CDN/Assets)   │    │   (CDN/Assets)   │
        └────────┬─────────┘    └────────┬─────────┘
                 │                        │
        ┌────────▼─────────┐    ┌────────▼─────────┐
        │   AWS Amplify    │    │   AWS Amplify    │
        │   (Rent App)     │    │   (Lead Gen)     │
        └────────┬─────────┘    └────────┬─────────┘
                 │                        │
                 ├────────────┬───────────┤
                 │            │           │
        ┌────────▼─────┐  ┌──▼────┐  ┌──▼────┐
        │   RDS        │  │  S3   │  │  SES  │
        │ PostgreSQL   │  │(Files)│  │(Email)│
        └──────────────┘  └───────┘  └───────┘
```

### Services Used

- **AWS Amplify**: Hosting and CI/CD for Next.js applications
- **Amazon RDS**: PostgreSQL databases (one per app)
- **Amazon S3**: Asset storage (photos, documents)
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **SES**: Transactional email
- **Secrets Manager**: Secure credential storage
- **CloudWatch**: Logging and monitoring

---

## Prerequisites

### Required Tools

1. **AWS CLI** (v2.x or later)
   ```bash
   # Install AWS CLI
   # macOS
   brew install awscli

   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Verify installation
   aws --version
   ```

2. **Terraform** (v1.0 or later) - Optional, if using Terraform approach
   ```bash
   # Install Terraform
   # macOS
   brew tap hashicorp/tap
   brew install hashicorp/tap/terraform

   # Verify installation
   terraform --version
   ```

3. **jq** - JSON processor for scripts
   ```bash
   # macOS
   brew install jq

   # Linux
   sudo apt-get install jq
   ```

### AWS Account Setup

1. **Create AWS Account**
   - Visit [aws.amazon.com](https://aws.amazon.com)
   - Follow signup process
   - Set up billing alerts

2. **Create IAM User**
   ```bash
   # Create user with appropriate permissions
   # Required permissions:
   # - AmazonRDSFullAccess
   # - AmazonS3FullAccess
   # - CloudFrontFullAccess
   # - AWSAmplifyFullAccess
   # - AmazonSESFullAccess
   # - AWSCloudFormationFullAccess or equivalent Terraform permissions
   # - IAMFullAccess (for creating roles)
   # - AmazonVPCFullAccess
   ```

3. **Configure AWS CLI**
   ```bash
   aws configure
   # AWS Access Key ID: [your-access-key]
   # AWS Secret Access Key: [your-secret-key]
   # Default region name: us-east-1
   # Default output format: json
   ```

### Domain Requirements

1. **Purchase Domain** (if not already owned)
   - Can use Route 53 or external registrar
   - Recommended: nivasesa.com for rent-app
   - Recommended: leads.nivasesa.com for lead-gen

2. **Verify Domain Access**
   - Access to DNS records
   - Ability to create TXT records for verification

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_ORG/nivasesa.git
cd nivasesa
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Setup Script

```bash
chmod +x scripts/setup-aws.sh
./scripts/setup-aws.sh
```

The script will guide you through:
- Choosing CloudFormation or Terraform
- Creating SSL certificates
- Setting up VPC and networking
- Deploying database infrastructure
- Configuring S3 and CloudFront
- Setting up SES for email

---

## Infrastructure Deployment

### Option A: CloudFormation (AWS Native)

#### 1. Create SSL Certificates

```bash
# Go to ACM in us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name nivasesa.com \
  --subject-alternative-names "*.nivasesa.com" "leads.nivasesa.com" \
  --validation-method DNS \
  --region us-east-1
```

**Important**: Validate certificate via DNS records before proceeding.

#### 2. Deploy Database Stack

```bash
aws cloudformation create-stack \
  --stack-name production-nivasesa-database \
  --template-body file://infrastructure/cloudformation/database.yml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=VPCId,ParameterValue=vpc-xxxxx \
    ParameterKey=PrivateSubnet1,ParameterValue=subnet-xxxxx \
    ParameterKey=PrivateSubnet2,ParameterValue=subnet-yyyyy \
    ParameterKey=MasterUsername,ParameterValue=nivasesaadmin \
    ParameterKey=MasterPassword,ParameterValue=YOUR_SECURE_PASSWORD \
  --capabilities CAPABILITY_IAM

# Wait for completion (10-15 minutes)
aws cloudformation wait stack-create-complete \
  --stack-name production-nivasesa-database
```

#### 3. Deploy Storage Stack

```bash
aws cloudformation create-stack \
  --stack-name production-nivasesa-storage \
  --template-body file://infrastructure/cloudformation/storage.yml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=RentAppDomain,ParameterValue=nivasesa.com \
    ParameterKey=LeadGenDomain,ParameterValue=leads.nivasesa.com \
    ParameterKey=ACMCertificateArn,ParameterValue=arn:aws:acm:us-east-1:xxxxx:certificate/xxxxx

aws cloudformation wait stack-create-complete \
  --stack-name production-nivasesa-storage
```

#### 4. Deploy Email Stack

```bash
aws cloudformation create-stack \
  --stack-name production-nivasesa-email \
  --template-body file://infrastructure/cloudformation/email.yml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=RentAppDomain,ParameterValue=nivasesa.com \
    ParameterKey=LeadGenDomain,ParameterValue=leads.nivasesa.com \
    ParameterKey=AdminEmail,ParameterValue=admin@nivasesa.com \
  --capabilities CAPABILITY_IAM

aws cloudformation wait stack-create-complete \
  --stack-name production-nivasesa-email
```

### Option B: Terraform

#### 1. Configure Variables

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
vim terraform.tfvars
```

#### 2. Initialize and Plan

```bash
terraform init
terraform plan
```

#### 3. Apply Infrastructure

```bash
terraform apply
```

#### 4. Save Outputs

```bash
terraform output > ../../.terraform-outputs.txt
```

---

## Application Deployment

### 1. Set Up GitHub Repository

```bash
# Ensure code is pushed to GitHub
git remote add origin https://github.com/YOUR_ORG/nivasesa.git
git push -u origin main
```

### 2. Create Amplify Apps

#### Rent App

```bash
# Create app
aws amplify create-app \
  --name "Nivasesa-Rent-App" \
  --repository "https://github.com/YOUR_ORG/nivasesa" \
  --platform WEB \
  --oauth-token YOUR_GITHUB_TOKEN

# Get app ID
RENT_APP_ID=$(aws amplify list-apps --query "apps[?name=='Nivasesa-Rent-App'].appId" --output text)

# Create branch
aws amplify create-branch \
  --app-id $RENT_APP_ID \
  --branch-name main \
  --framework "Next.js - SSR"

# Configure build settings
aws amplify update-app \
  --app-id $RENT_APP_ID \
  --build-spec "$(cat infrastructure/amplify-rent-app.yml)"
```

#### Lead Gen App

```bash
# Create app
aws amplify create-app \
  --name "Nivasesa-Lead-Gen" \
  --repository "https://github.com/YOUR_ORG/nivasesa" \
  --platform WEB \
  --oauth-token YOUR_GITHUB_TOKEN

# Get app ID
LEAD_GEN_APP_ID=$(aws amplify list-apps --query "apps[?name=='Nivasesa-Lead-Gen'].appId" --output text)

# Create branch
aws amplify create-branch \
  --app-id $LEAD_GEN_APP_ID \
  --branch-name main \
  --framework "Next.js - SSR"

# Configure build settings
aws amplify update-app \
  --app-id $LEAD_GEN_APP_ID \
  --build-spec "$(cat infrastructure/amplify-lead-gen.yml)"
```

### 3. Configure Environment Variables

See [Environment Variables](#environment-variables) section below.

### 4. Deploy Applications

```bash
# Use deployment script
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

Or manually:

```bash
# Trigger build for rent-app
aws amplify start-job \
  --app-id $RENT_APP_ID \
  --branch-name main \
  --job-type RELEASE

# Trigger build for lead-gen
aws amplify start-job \
  --app-id $LEAD_GEN_APP_ID \
  --branch-name main \
  --job-type RELEASE
```

---

## DNS Configuration

### 1. Get DNS Records

```bash
# Get Amplify app domains
RENT_APP_DOMAIN=$(aws amplify get-app --app-id $RENT_APP_ID --query 'app.defaultDomain' --output text)
LEAD_GEN_DOMAIN=$(aws amplify get-app --app-id $LEAD_GEN_APP_ID --query 'app.defaultDomain' --output text)

# Get CloudFront distributions
RENT_CDN=$(aws cloudformation describe-stacks \
  --stack-name production-nivasesa-storage \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppAssetsDistributionDomain'].OutputValue" \
  --output text)

LEAD_CDN=$(aws cloudformation describe-stacks \
  --stack-name production-nivasesa-storage \
  --query "Stacks[0].Outputs[?OutputKey=='LeadGenAssetsDistributionDomain'].OutputValue" \
  --output text)
```

### 2. Configure DNS Records

Add these records to your DNS provider:

#### For nivasesa.com (Rent App)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | main.$RENT_APP_DOMAIN | 300 |
| CNAME | www | main.$RENT_APP_DOMAIN | 300 |
| CNAME | assets | $RENT_CDN | 300 |

#### For leads.nivasesa.com (Lead Gen)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | leads | main.$LEAD_GEN_DOMAIN | 300 |
| CNAME | assets.leads | $LEAD_CDN | 300 |

#### For SES (Email)

```bash
# Get SES DNS records
aws ses get-identity-dkim-attributes \
  --identities nivasesa.com leads.nivasesa.com
```

Add the DKIM records provided by SES.

### 3. Verify DNS Propagation

```bash
# Check DNS resolution
dig nivasesa.com
dig leads.nivasesa.com
dig assets.nivasesa.com
```

---

## Environment Variables

### Rent App Environment Variables

Configure in Amplify Console or via CLI:

```bash
aws amplify update-app \
  --app-id $RENT_APP_ID \
  --environment-variables \
    NODE_ENV=production \
    DATABASE_URL="postgresql://user:pass@host:5432/rentapp" \
    AUTH_SECRET="$(openssl rand -base64 32)" \
    NEXTAUTH_URL="https://nivasesa.com" \
    GOOGLE_CLIENT_ID="your-google-client-id" \
    GOOGLE_CLIENT_SECRET="your-google-client-secret" \
    GITHUB_ID="your-github-id" \
    GITHUB_SECRET="your-github-secret" \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." \
    STRIPE_SECRET_KEY="sk_live_..." \
    STRIPE_WEBHOOK_SECRET="whsec_..." \
    NEXT_PUBLIC_FIREBASE_API_KEY="..." \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..." \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="..." \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..." \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..." \
    NEXT_PUBLIC_FIREBASE_APP_ID="..." \
    FIREBASE_ADMIN_PRIVATE_KEY="..." \
    FIREBASE_ADMIN_CLIENT_EMAIL="..." \
    AWS_REGION="us-east-1" \
    AWS_S3_BUCKET="production-nivasesa-rent-app-assets" \
    AWS_SES_REGION="us-east-1" \
    AWS_SES_FROM_EMAIL="noreply@nivasesa.com" \
    LAUNCHED="true"
```

### Lead Gen App Environment Variables

```bash
aws amplify update-app \
  --app-id $LEAD_GEN_APP_ID \
  --environment-variables \
    NODE_ENV=production \
    DATABASE_URL="postgresql://user:pass@host:5432/leadgen" \
    AUTH_SECRET="$(openssl rand -base64 32)" \
    NEXTAUTH_URL="https://leads.nivasesa.com" \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." \
    STRIPE_SECRET_KEY="sk_live_..." \
    STRIPE_WEBHOOK_SECRET="whsec_..." \
    AWS_REGION="us-east-1" \
    AWS_S3_BUCKET="production-nivasesa-lead-gen-assets" \
    AWS_SES_REGION="us-east-1" \
    AWS_SES_FROM_EMAIL="noreply@leads.nivasesa.com" \
    LAUNCHED="true"
```

### Retrieving Database URLs

```bash
# From CloudFormation
aws cloudformation describe-stacks \
  --stack-name production-nivasesa-database \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppDBConnectionString'].OutputValue" \
  --output text

# From Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id production/nivasesa/rent-app/database \
  --query SecretString \
  --output text | jq -r '.password'
```

### Environment Variable Checklist

#### Required for Both Apps
- [ ] NODE_ENV
- [ ] DATABASE_URL
- [ ] AUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] AWS_REGION
- [ ] AWS_S3_BUCKET
- [ ] AWS_SES_REGION
- [ ] AWS_SES_FROM_EMAIL
- [ ] LAUNCHED

#### Additional for Rent App
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GITHUB_ID
- [ ] GITHUB_SECRET
- [ ] Firebase credentials (all 7 variables)

---

## Database Setup

### 1. Access Database

```bash
# Get database endpoint
DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name production-nivasesa-database \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppDBEndpoint'].OutputValue" \
  --output text)

# Connect via psql
psql -h $DB_ENDPOINT -U nivasesaadmin -d rentapp
```

### 2. Run Migrations

```bash
# For rent-app
cd apps/rent-app
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# For lead-gen
cd apps/lead-gen
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 3. Seed Initial Data (if needed)

```bash
# Create seed script or manually insert
psql -h $DB_ENDPOINT -U nivasesaadmin -d rentapp < seeds/initial-data.sql
```

### 4. Set Up Database Backups

Automated backups are configured in CloudFormation/Terraform:
- Retention: 7 days
- Backup window: 3:00-4:00 AM UTC
- Maintenance window: Monday 4:00-5:00 AM UTC

Manual backup:

```bash
aws rds create-db-snapshot \
  --db-instance-identifier production-nivasesa-rent-app-db \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
```

---

## Monitoring and Logs

### CloudWatch Logs

#### View Amplify Build Logs

```bash
# List recent builds
aws amplify list-jobs \
  --app-id $RENT_APP_ID \
  --branch-name main

# Get specific job logs
aws amplify get-job \
  --app-id $RENT_APP_ID \
  --branch-name main \
  --job-id JOB_ID
```

#### View Application Logs

Logs are automatically sent to CloudWatch:

```bash
# List log groups
aws logs describe-log-groups --log-group-name-prefix /aws/amplify

# Tail logs
aws logs tail /aws/amplify/RENT_APP_ID/main --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/amplify/RENT_APP_ID/main \
  --filter-pattern "ERROR"
```

#### View Database Logs

```bash
# List log files
aws rds describe-db-log-files \
  --db-instance-identifier production-nivasesa-rent-app-db

# Download log file
aws rds download-db-log-file-portion \
  --db-instance-identifier production-nivasesa-rent-app-db \
  --log-file-name error/postgresql.log.2024-01-04-00
```

### CloudWatch Alarms

Set up alarms for critical metrics:

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name rent-app-high-error-rate \
  --alarm-description "Alert on high error rate" \
  --metric-name 4xxErrorRate \
  --namespace AWS/AmplifyHosting \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold

# Database CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name database-high-cpu \
  --alarm-description "Alert on high DB CPU" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80.0 \
  --comparison-operator GreaterThanThreshold
```

### Cost Monitoring

```bash
# Get current month cost
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=SERVICE

# Set up budget alert
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget-config.json
```

---

## Troubleshooting

### Build Failures

#### Issue: Amplify build fails

```bash
# Check build logs
aws amplify get-job \
  --app-id $RENT_APP_ID \
  --branch-name main \
  --job-id JOB_ID

# Common causes:
# 1. Missing environment variables
# 2. Package installation failures
# 3. TypeScript errors
# 4. Database connection issues

# Solutions:
# - Verify all env vars are set
# - Check package.json for correct versions
# - Run local build to catch errors
# - Verify DATABASE_URL is accessible
```

#### Issue: "Cannot find module" errors

```bash
# Ensure workspace dependencies are correctly linked
# Check amplify.yml has correct pnpm installation
# Verify pnpm-lock.yaml is committed
```

### Database Issues

#### Issue: Cannot connect to database

```bash
# Check security group rules
aws ec2 describe-security-groups \
  --group-ids sg-xxxxx

# Verify database is running
aws rds describe-db-instances \
  --db-instance-identifier production-nivasesa-rent-app-db

# Test connection from Amplify
# Add temporary debug code in app to log connection attempts
```

#### Issue: Migration fails

```bash
# Check current schema version
DATABASE_URL="..." npx prisma migrate status

# Reset (DANGEROUS - only in emergencies)
DATABASE_URL="..." npx prisma migrate reset

# Apply specific migration
DATABASE_URL="..." npx prisma migrate deploy
```

### Email Issues

#### Issue: SES sending fails

```bash
# Check SES sending quota
aws ses get-send-quota

# Check if email is verified (sandbox mode)
aws ses list-verified-email-addresses

# Request production access
# Go to SES Console > Account Dashboard > Request Production Access

# Check bounce/complaint rate
aws ses get-account-sending-enabled
```

#### Issue: Emails go to spam

```bash
# Verify DKIM records
aws ses get-identity-dkim-attributes \
  --identities nivasesa.com

# Check SPF record
dig TXT nivasesa.com

# Ensure proper email formatting:
# - Valid From address
# - Proper headers
# - Text and HTML versions
# - Unsubscribe link
```

### Performance Issues

#### Issue: Slow page loads

```bash
# Check CloudFront cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=DISTRIBUTION_ID \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# Solutions:
# - Enable Next.js image optimization
# - Configure proper cache headers
# - Use CloudFront caching for static assets
# - Optimize database queries
```

#### Issue: High database CPU

```bash
# Check slow queries
# Connect to database and run:
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';

# Solutions:
# - Add database indexes
# - Optimize N+1 queries
# - Enable connection pooling
# - Scale up instance class
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Module not found" | Missing dependency or wrong path | Check package.json, verify pnpm install |
| "Database connection failed" | Network/credentials issue | Verify DATABASE_URL, security groups |
| "CORS error" | CloudFront/S3 misconfiguration | Check CORS rules in S3 bucket policy |
| "Memory limit exceeded" | Build or runtime memory issue | Increase Amplify compute size |
| "Certificate validation failed" | ACM certificate not validated | Complete DNS validation for cert |

---

## Cost Estimation

### Monthly Cost Breakdown (Production)

#### Compute & Hosting
- **AWS Amplify** (2 apps)
  - Build minutes: ~20 builds/month × 10 min = $1.00
  - Hosting: $0.15/GB × 2GB = $0.30
  - Data transfer: $0.15/GB × 50GB = $7.50
  - **Subtotal: ~$9/month**

#### Database
- **RDS PostgreSQL** (2 instances)
  - db.t3.micro: $0.017/hr × 730hr × 2 = $24.82
  - Storage: $0.115/GB × 20GB × 2 = $4.60
  - Backup: $0.095/GB × 20GB × 2 = $3.80
  - **Subtotal: ~$33/month**

#### Storage & CDN
- **S3**
  - Storage: $0.023/GB × 10GB = $0.23
  - Requests: $0.005/1000 × 10,000 = $0.05
  - **Subtotal: ~$0.30/month**

- **CloudFront**
  - Data transfer: $0.085/GB × 100GB = $8.50
  - Requests: $0.01/10,000 × 100,000 = $1.00
  - **Subtotal: ~$9.50/month**

#### Email
- **SES**
  - $0.10/1000 emails × 5,000 = $0.50
  - **Subtotal: ~$0.50/month**

#### Other Services
- **Secrets Manager**: $0.40/secret × 4 = $1.60
- **CloudWatch Logs**: ~$2/month
- **Route 53**: $0.50/hosted zone × 2 = $1.00
- **Subtotal: ~$5/month**

### Total Estimated Cost

**~$57/month** for production environment with:
- 2 Next.js applications
- 2 PostgreSQL databases (db.t3.micro)
- 100GB CDN transfer
- 5,000 emails
- Basic monitoring

### Cost Optimization Tips

1. **Development Environment**
   - Use db.t3.micro instead of db.r6g.large
   - Single-AZ RDS instead of Multi-AZ
   - Reduce backup retention to 1 day
   - **Savings: ~60%**

2. **Production Optimization**
   - Enable S3 Intelligent-Tiering for old assets
   - Use CloudFront compression
   - Implement proper caching to reduce database load
   - Clean up unused CloudWatch logs
   - **Potential savings: 20-30%**

3. **Reserved Instances**
   - 1-year RDS reserved instance: ~40% discount
   - 3-year commitment: ~60% discount

4. **Monitoring Costs**
   - Set up AWS Budget alerts
   - Review monthly cost reports
   - Tag resources for cost allocation

---

## Additional Resources

### AWS Documentation
- [Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [CloudFront](https://docs.aws.amazon.com/cloudfront/)
- [SES](https://docs.aws.amazon.com/ses/)

### Nivasesa Documentation
- [Project README](/README.md)
- [API Documentation](/docs/API.md)
- [Security Guide](/docs/DANGEROUS-MODE.md)

### Support
- AWS Support: [console.aws.amazon.com/support](https://console.aws.amazon.com/support)
- Team Slack: #infrastructure
- On-call: See PagerDuty

---

## Appendix

### A. Environment Variable Reference

Complete list available in:
- `/apps/rent-app/.env.example`
- `/apps/lead-gen/.env.example`

### B. Database Schema

Latest schema:
- `/apps/rent-app/prisma/schema.prisma`
- `/apps/lead-gen/prisma/schema.prisma`

### C. DNS Records Template

See `/infrastructure/dns-records-template.txt`

### D. Disaster Recovery

Backup restoration procedure:
```bash
# Restore RDS from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier new-instance \
  --db-snapshot-identifier snapshot-id

# Restore S3 from versioning
aws s3api list-object-versions --bucket BUCKET_NAME

# Rollback Amplify deployment
aws amplify start-job \
  --app-id APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --commit-id PREVIOUS_COMMIT
```
