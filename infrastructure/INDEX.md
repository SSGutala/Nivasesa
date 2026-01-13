# Infrastructure File Index

Quick reference for all infrastructure and deployment files.

## Start Here

| File | Purpose | When to Use |
|------|---------|-------------|
| [QUICK_START.md](QUICK_START.md) | 30-minute deployment guide | First deployment |
| [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) | Complete overview | Understanding architecture |
| [README.md](README.md) | Infrastructure documentation | Reference |

## Deployment Guides

### Step-by-Step Instructions

| File | Description | Audience |
|------|-------------|----------|
| [/docs/AWS_DEPLOYMENT.md](/docs/AWS_DEPLOYMENT.md) | Comprehensive 24KB deployment guide | DevOps, First-time deployers |
| [QUICK_START.md](QUICK_START.md) | Fast track deployment (30 min) | Experienced AWS users |
| [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) | Complete env var reference | All deployers |

### Configuration Reference

| File | Description |
|------|-------------|
| [README.md](README.md) | Infrastructure overview and architecture |
| [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) | What was created and why |

## Infrastructure Configuration

### AWS Amplify

| File | Purpose |
|------|---------|
| [amplify-rent-app.yml](amplify-rent-app.yml) | Build specification for rent-app |
| [amplify-lead-gen.yml](amplify-lead-gen.yml) | Build specification for lead-gen |

**Usage**: Upload to Amplify Console > Build settings

### CloudFormation Templates

| File | Creates | Cost |
|------|---------|------|
| [cloudformation/database.yml](cloudformation/database.yml) | 2x RDS PostgreSQL databases | ~$33/mo |
| [cloudformation/storage.yml](cloudformation/storage.yml) | 2x S3 buckets + CloudFront CDN | ~$10/mo |
| [cloudformation/email.yml](cloudformation/email.yml) | SES email configuration | ~$0.50/mo |

**Usage**:
```bash
aws cloudformation create-stack \
  --stack-name production-nivasesa-database \
  --template-body file://cloudformation/database.yml
```

### Terraform Configuration

| File | Purpose |
|------|---------|
| [terraform/main.tf](terraform/main.tf) | Main Terraform configuration |
| [terraform/variables.tf](terraform/variables.tf) | Variable definitions |
| [terraform/outputs.tf](terraform/outputs.tf) | Output values |
| [terraform/terraform.tfvars.example](terraform/terraform.tfvars.example) | Example variable values |

**Usage**:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Deployment Scripts

### Automated Setup

| Script | Purpose | Usage |
|--------|---------|-------|
| [/scripts/setup-aws.sh](/scripts/setup-aws.sh) | Initial AWS infrastructure setup | `./scripts/setup-aws.sh` |
| [/scripts/deploy-production.sh](/scripts/deploy-production.sh) | Deploy apps to Amplify | `./scripts/deploy-production.sh` |

Both scripts are executable and interactive.

## Environment Configuration

### Production Environment Templates

| File | For | Variables |
|------|-----|-----------|
| [/apps/rent-app/.env.production.example](/apps/rent-app/.env.production.example) | Rent App | 21 (14 required + 7 Firebase) |
| [/apps/lead-gen/.env.production.example](/apps/lead-gen/.env.production.example) | Lead Gen | 14 (9 required) |

**Usage**:
1. Copy to `.env.production`
2. Fill in actual values
3. Never commit to git
4. Configure in Amplify Console

## Quick Navigation

### By Task

| I Want To... | Go To |
|--------------|-------|
| Deploy for first time | [QUICK_START.md](QUICK_START.md) |
| Understand architecture | [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) |
| Configure environment variables | [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) |
| Troubleshoot deployment | [/docs/AWS_DEPLOYMENT.md](/docs/AWS_DEPLOYMENT.md) |
| Set up CloudFormation | [cloudformation/database.yml](cloudformation/database.yml) |
| Set up Terraform | [terraform/main.tf](terraform/main.tf) |
| Configure Amplify builds | [amplify-rent-app.yml](amplify-rent-app.yml) |
| Estimate costs | [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md#cost-breakdown) |
| Run automated setup | `/scripts/setup-aws.sh` |
| Deploy to production | `/scripts/deploy-production.sh` |

### By Service

| AWS Service | Configuration Files | Documentation |
|-------------|-------------------|---------------|
| **Amplify** | amplify-rent-app.yml, amplify-lead-gen.yml | [AWS_DEPLOYMENT.md#application-deployment](/docs/AWS_DEPLOYMENT.md#application-deployment) |
| **RDS** | cloudformation/database.yml, terraform/modules/rds | [AWS_DEPLOYMENT.md#database-setup](/docs/AWS_DEPLOYMENT.md#database-setup) |
| **S3** | cloudformation/storage.yml | [AWS_DEPLOYMENT.md#dns-configuration](/docs/AWS_DEPLOYMENT.md#dns-configuration) |
| **CloudFront** | cloudformation/storage.yml | [README.md#3-amazon-s3--cloudfront](README.md#3-amazon-s3--cloudfront-storage--cdn) |
| **SES** | cloudformation/email.yml | [AWS_DEPLOYMENT.md#dns-configuration](/docs/AWS_DEPLOYMENT.md#dns-configuration) |

### By Stage

| Deployment Stage | Files Needed | Documentation |
|-----------------|--------------|---------------|
| **1. Planning** | DEPLOYMENT_SUMMARY.md | Understanding what will be created |
| **2. Prerequisites** | QUICK_START.md | AWS CLI, domain, credentials |
| **3. SSL Certificates** | QUICK_START.md | ACM certificate creation |
| **4. Infrastructure** | cloudformation/*.yml OR terraform/*.tf | Database, storage, email |
| **5. Applications** | amplify-*.yml, .env.production.example | Amplify apps and env vars |
| **6. DNS** | AWS_DEPLOYMENT.md#dns-configuration | CNAME, DKIM records |
| **7. Verification** | QUICK_START.md#verification-checklist | Testing deployment |

## File Sizes

| File | Size | Reading Time |
|------|------|--------------|
| AWS_DEPLOYMENT.md | 24 KB | 30 min |
| DEPLOYMENT_SUMMARY.md | 17 KB | 20 min |
| ENVIRONMENT_VARIABLES.md | 16 KB | 15 min |
| README.md | 13 KB | 15 min |
| QUICK_START.md | 10 KB | 10 min |
| database.yml | 7 KB | 5 min |
| storage.yml | 7 KB | 5 min |
| email.yml | 6 KB | 5 min |
| setup-aws.sh | 10 KB | 5 min |
| deploy-production.sh | 8 KB | 5 min |

## Cheat Sheet

### First Time Deployment

```bash
# 1. Prerequisites
aws configure
aws sts get-caller-identity

# 2. Create SSL cert
aws acm request-certificate \
  --domain-name nivasesa.com \
  --subject-alternative-names "*.nivasesa.com" "leads.nivasesa.com" \
  --validation-method DNS \
  --region us-east-1

# 3. Run setup
./scripts/setup-aws.sh

# 4. Deploy apps
./scripts/deploy-production.sh
```

### Getting Values

```bash
# Database URL
aws cloudformation describe-stacks \
  --stack-name production-nivasesa-database \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppDBConnectionString'].OutputValue" \
  --output text

# S3 Bucket
aws cloudformation describe-stacks \
  --stack-name production-nivasesa-storage \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppAssetsBucketName'].OutputValue" \
  --output text

# Amplify URL
aws amplify get-app --app-id APP_ID --query 'app.defaultDomain' --output text
```

### Common Commands

```bash
# Check build status
aws amplify list-jobs --app-id APP_ID --branch-name main

# View logs
aws logs tail /aws/amplify/APP_ID/main --follow

# Create DB snapshot
aws rds create-db-snapshot \
  --db-instance-identifier production-nivasesa-rent-app-db \
  --db-snapshot-identifier backup-$(date +%Y%m%d)

# Check costs
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics UnblendedCost
```

## Support

### Questions?

| Topic | Resource |
|-------|----------|
| Architecture questions | [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) |
| Deployment issues | [/docs/AWS_DEPLOYMENT.md#troubleshooting](/docs/AWS_DEPLOYMENT.md#troubleshooting) |
| Environment variables | [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) |
| Cost questions | [DEPLOYMENT_SUMMARY.md#cost-breakdown](DEPLOYMENT_SUMMARY.md#cost-breakdown) |
| AWS service issues | [AWS Support Console](https://console.aws.amazon.com/support) |

### External Links

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-04 | 1.0.0 | Initial infrastructure configuration |

---

**Quick Links**: [Quick Start](QUICK_START.md) | [Full Guide](/docs/AWS_DEPLOYMENT.md) | [Environment Vars](ENVIRONMENT_VARIABLES.md) | [Summary](DEPLOYMENT_SUMMARY.md)
