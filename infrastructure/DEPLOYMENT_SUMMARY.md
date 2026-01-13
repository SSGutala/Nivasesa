# AWS Infrastructure Deployment Summary

This document summarizes the complete AWS infrastructure configuration created for Nivasesa.

## What Was Created

### 1. Infrastructure Configuration Files

#### Amplify Build Specifications
- `/infrastructure/amplify-rent-app.yml` - Build config for rent-app
- `/infrastructure/amplify-lead-gen.yml` - Build config for lead-gen

#### CloudFormation Templates
- `/infrastructure/cloudformation/database.yml` - RDS PostgreSQL databases
- `/infrastructure/cloudformation/storage.yml` - S3 buckets and CloudFront CDN
- `/infrastructure/cloudformation/email.yml` - AWS SES email service

#### Terraform Configurations
- `/infrastructure/terraform/main.tf` - Main Terraform config
- `/infrastructure/terraform/variables.tf` - Variable definitions
- `/infrastructure/terraform/outputs.tf` - Output definitions
- `/infrastructure/terraform/terraform.tfvars.example` - Example values

### 2. Deployment Scripts

#### Setup Script
- `/scripts/setup-aws.sh` - Interactive AWS infrastructure setup
  - Guides through CloudFormation or Terraform choice
  - Creates SSL certificates
  - Deploys database, storage, and email stacks
  - Generates secure passwords

#### Deployment Script
- `/scripts/deploy-production.sh` - Production deployment automation
  - Pre-deployment checks (tests, typecheck)
  - Triggers Amplify builds
  - Monitors deployment progress
  - Saves deployment records

### 3. Documentation

#### Comprehensive Guides
- `/docs/AWS_DEPLOYMENT.md` - Complete deployment guide (24KB)
  - Architecture overview
  - Step-by-step instructions
  - DNS configuration
  - Environment variables
  - Troubleshooting
  - Cost estimation

#### Quick References
- `/infrastructure/README.md` - Infrastructure overview
- `/infrastructure/QUICK_START.md` - 30-minute deployment guide
- `/infrastructure/ENVIRONMENT_VARIABLES.md` - Complete env var reference

### 4. Environment Configuration

#### Production Environment Files
- `/apps/rent-app/.env.production.example` - Rent app production env template
- `/apps/lead-gen/.env.production.example` - Lead gen production env template

---

## Infrastructure Architecture

### Services Deployed

```
┌─────────────────────────────────────────────────────────────┐
│                      Route 53 (DNS)                         │
└────────────────┬────────────────────────┬───────────────────┘
                 │                        │
        ┌────────▼─────────┐    ┌────────▼─────────┐
        │   CloudFront     │    │   CloudFront     │
        │   assets.*       │    │   assets.leads.* │
        └────────┬─────────┘    └────────┬─────────┘
                 │                        │
        ┌────────▼─────────┐    ┌────────▼─────────┐
        │      S3          │    │      S3          │
        │   (assets)       │    │   (assets)       │
        └──────────────────┘    └──────────────────┘

        ┌─────────────────┐    ┌─────────────────┐
        │  AWS Amplify    │    │  AWS Amplify    │
        │  nivasesa.com   │    │  leads.*        │
        └────────┬────────┘    └────────┬────────┘
                 │                       │
                 ├───────────────────────┤
                 │                       │
        ┌────────▼────────┐    ┌────────▼────────┐
        │  RDS Postgres   │    │  RDS Postgres   │
        │  (rent-app)     │    │  (lead-gen)     │
        └─────────────────┘    └─────────────────┘

        ┌──────────────────────────────────────────┐
        │           AWS SES (Email)                │
        │  - noreply@nivasesa.com                  │
        │  - noreply@leads.nivasesa.com            │
        └──────────────────────────────────────────┘

        ┌──────────────────────────────────────────┐
        │      AWS Secrets Manager                 │
        │  - Database credentials                  │
        │  - API keys                              │
        └──────────────────────────────────────────┘
```

### Resource Inventory

| Service | Resource | Purpose | Count |
|---------|----------|---------|-------|
| AWS Amplify | App | Next.js hosting | 2 |
| RDS | PostgreSQL DB | Data storage | 2 |
| S3 | Bucket | Asset storage | 2 |
| CloudFront | Distribution | CDN | 2 |
| SES | Domain Identity | Email sending | 2 |
| SES | Configuration Set | Email tracking | 2 |
| Secrets Manager | Secret | Credentials | 2+ |
| CloudWatch | Log Group | Application logs | 4+ |
| VPC | Security Group | Network security | 1+ |
| Route 53 | Hosted Zone | DNS (optional) | 1-2 |

---

## Deployment Approaches

### Option A: CloudFormation (AWS Native)

**Pros**:
- No additional tools required
- Native AWS support
- Change sets for previews
- Stack outputs for cross-references

**Usage**:
```bash
./scripts/setup-aws.sh
# Choose option 1 (CloudFormation)
```

**Stacks Created**:
1. `production-nivasesa-database` - RDS instances
2. `production-nivasesa-storage` - S3 and CloudFront
3. `production-nivasesa-email` - SES configuration

### Option B: Terraform

**Pros**:
- Multi-cloud portability
- Better variable handling
- State management
- Module reusability

**Usage**:
```bash
./scripts/setup-aws.sh
# Choose option 2 (Terraform)
```

**Modules** (to be implemented):
- `vpc` - VPC and networking
- `rds` - PostgreSQL databases
- `storage` - S3 and CloudFront
- `email` - SES configuration
- `amplify` - Amplify apps

---

## Cost Breakdown

### Monthly Costs (Production)

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **AWS Amplify** | 2 apps, 20 builds/mo, 50GB transfer | $9 |
| **RDS PostgreSQL** | 2x db.t3.micro, 20GB, Multi-AZ | $33 |
| **S3** | 10GB storage, 10k requests | $0.30 |
| **CloudFront** | 100GB transfer, 100k requests | $9.50 |
| **SES** | 5,000 emails | $0.50 |
| **Secrets Manager** | 4 secrets | $1.60 |
| **CloudWatch** | Logs and metrics | $2 |
| **Route 53** | 2 hosted zones (optional) | $1 |
| **TOTAL** | | **~$57/month** |

### Cost Optimization Tips

1. **Development**: Use `db.t3.micro` single-AZ (-60%)
2. **Reserved Instances**: 1-year RDS reserved (-40%)
3. **S3 Lifecycle**: Archive old assets to Glacier
4. **CloudWatch**: Set log retention to 7 days
5. **Monitoring**: Use AWS Budgets to track spending

---

## Environment Variables Required

### Rent App (14 required + 7 Firebase)

**Critical**:
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - Session encryption
- `NEXTAUTH_URL` - App URL
- `STRIPE_SECRET_KEY` - Payment processing
- `STRIPE_WEBHOOK_SECRET` - Webhook verification
- `AWS_S3_BUCKET` - Asset storage
- `AWS_SES_FROM_EMAIL` - Email sender

**OAuth**:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`, `GITHUB_SECRET`

**Firebase** (7 variables):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `FIREBASE_ADMIN_CLIENT_EMAIL`

### Lead Gen App (9 required)

**Critical**:
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - Session encryption (different!)
- `NEXTAUTH_URL` - App URL
- `STRIPE_SECRET_KEY` - Payment processing
- `STRIPE_WEBHOOK_SECRET` - Webhook (different endpoint!)
- `AWS_S3_BUCKET` - Asset storage
- `AWS_SES_FROM_EMAIL` - Email sender

See `/infrastructure/ENVIRONMENT_VARIABLES.md` for complete reference.

---

## Deployment Checklist

### Pre-Deployment

- [ ] AWS account created and configured
- [ ] AWS CLI installed (`aws --version`)
- [ ] Domain purchased
- [ ] GitHub repository ready
- [ ] Local development working
- [ ] All tests passing

### Infrastructure Setup

- [ ] SSL certificate created and validated (ACM)
- [ ] Database stack deployed (CloudFormation/Terraform)
- [ ] Storage stack deployed (S3 + CloudFront)
- [ ] Email stack deployed (SES)
- [ ] Secrets stored in Secrets Manager
- [ ] VPC and security groups configured

### Application Setup

- [ ] Amplify apps created (rent-app, lead-gen)
- [ ] GitHub connected to Amplify
- [ ] Build specifications uploaded
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Initial data seeded (if needed)

### DNS Configuration

- [ ] CNAME records for apps (nivasesa.com, leads.*)
- [ ] CNAME records for assets (assets.nivasesa.com)
- [ ] DKIM records for SES
- [ ] SPF records for email
- [ ] DNS propagation verified

### Post-Deployment

- [ ] Applications accessible via HTTPS
- [ ] SSL certificates working (no warnings)
- [ ] Database connections working
- [ ] File uploads to S3 working
- [ ] Email sending working
- [ ] Authentication working (login/signup)
- [ ] Payment processing working
- [ ] CloudWatch logs flowing
- [ ] Monitoring alerts configured

### Security

- [ ] SES out of sandbox mode
- [ ] OAuth apps configured with production URLs
- [ ] Stripe webhooks configured
- [ ] Secrets not exposed in logs
- [ ] Security groups properly restricted
- [ ] IAM roles follow least privilege

---

## Quick Start

### Fastest Path to Deployment

1. **Prerequisites** (10 min)
   ```bash
   aws configure
   aws sts get-caller-identity
   ```

2. **Create SSL Certificate** (5 min + validation)
   ```bash
   aws acm request-certificate \
     --domain-name nivasesa.com \
     --subject-alternative-names "*.nivasesa.com" "leads.nivasesa.com" \
     --validation-method DNS \
     --region us-east-1
   ```

3. **Run Setup Script** (15 min)
   ```bash
   ./scripts/setup-aws.sh
   ```

4. **Create Amplify Apps** (10 min)
   - Use AWS Console or CLI
   - Upload build specs
   - Configure environment variables

5. **Deploy** (5 min)
   ```bash
   ./scripts/deploy-production.sh
   ```

6. **Configure DNS** (5 min + propagation)
   - Add CNAME records
   - Add DKIM records

**Total Time**: ~30 minutes active + validation/propagation wait

See `/infrastructure/QUICK_START.md` for detailed guide.

---

## Monitoring and Maintenance

### CloudWatch Dashboards

Create dashboards for:
- Application errors (4xx, 5xx)
- Database performance (CPU, connections, IOPS)
- S3 storage usage
- CloudFront cache hit rate
- SES bounce/complaint rates

### Alarms

Set up alarms for:
```bash
# High error rate
aws cloudwatch put-metric-alarm \
  --alarm-name rent-app-high-errors \
  --metric-name 5xxErrors \
  --threshold 10

# Database CPU
aws cloudwatch put-metric-alarm \
  --alarm-name database-high-cpu \
  --metric-name CPUUtilization \
  --threshold 80

# High costs
aws budgets create-budget \
  --budget BudgetName=nivasesa-monthly,BudgetLimit={Amount=100,Unit=USD}
```

### Backup Strategy

**Automated**:
- RDS: Daily snapshots, 7-day retention
- S3: Versioning enabled, 30-day old version cleanup

**Manual**:
```bash
# Create database snapshot
aws rds create-db-snapshot \
  --db-instance-identifier production-nivasesa-rent-app-db \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)

# Backup infrastructure config
git add infrastructure/
git commit -m "Infrastructure backup $(date +%Y-%m-%d)"
```

---

## Troubleshooting

### Quick Diagnostics

```bash
# Check Amplify build status
aws amplify list-jobs --app-id $APP_ID --branch-name main

# Check database status
aws rds describe-db-instances \
  --db-instance-identifier production-nivasesa-rent-app-db

# Check recent logs
aws logs tail /aws/amplify/$APP_ID/main --follow

# Check stack status
aws cloudformation describe-stacks \
  --stack-name production-nivasesa-database
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check env vars, verify DATABASE_URL |
| DB connection fails | Check security group, verify credentials |
| Emails not sending | Verify SES out of sandbox, check DKIM |
| 404 on domain | Wait for DNS propagation (up to 48hr) |
| High costs | Check CloudWatch metrics, review usage |

See `/docs/AWS_DEPLOYMENT.md` for detailed troubleshooting.

---

## Security Considerations

### Implemented Security

1. **Encryption**
   - All RDS data encrypted at rest (AES-256)
   - S3 bucket encryption enabled
   - TLS 1.2+ for all traffic

2. **Access Control**
   - IAM roles for service access
   - Security groups restrict database access
   - Secrets in Secrets Manager

3. **Monitoring**
   - CloudWatch logs for all services
   - SES bounce/complaint tracking
   - CloudTrail for API audit logs

### Additional Security (Optional)

1. **AWS WAF** - DDoS protection, rate limiting
2. **GuardDuty** - Threat detection
3. **AWS Shield** - Enhanced DDoS protection
4. **VPC Flow Logs** - Network traffic analysis
5. **Config** - Resource compliance monitoring

---

## Next Steps

After deployment:

1. **Monitor First 24 Hours**
   - Watch CloudWatch logs
   - Test all critical flows
   - Monitor error rates

2. **Performance Optimization**
   - Review database query performance
   - Optimize CloudFront caching
   - Tune Next.js build

3. **Security Hardening**
   - Enable MFA for AWS account
   - Set up AWS Config rules
   - Schedule security audits

4. **Documentation**
   - Document custom configurations
   - Create runbooks for common tasks
   - Update team wiki

5. **Disaster Recovery**
   - Test database restoration
   - Practice application rollback
   - Document recovery procedures

---

## Support and Resources

### Documentation

- [AWS Deployment Guide](/docs/AWS_DEPLOYMENT.md) - Complete guide
- [Quick Start](/infrastructure/QUICK_START.md) - Fast deployment
- [Environment Variables](/infrastructure/ENVIRONMENT_VARIABLES.md) - Env reference
- [Infrastructure README](/infrastructure/README.md) - Overview

### AWS Resources

- [Amplify Console](https://console.aws.amazon.com/amplify)
- [RDS Console](https://console.aws.amazon.com/rds)
- [CloudWatch Console](https://console.aws.amazon.com/cloudwatch)
- [AWS Support](https://console.aws.amazon.com/support)

### External Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Stripe Production Checklist](https://stripe.com/docs/keys#production)

---

## File Index

All infrastructure files created:

```
infrastructure/
├── README.md                           # Infrastructure overview
├── QUICK_START.md                      # 30-minute deployment guide
├── ENVIRONMENT_VARIABLES.md            # Complete env var reference
├── DEPLOYMENT_SUMMARY.md               # This file
├── amplify-rent-app.yml                # Rent app build spec
├── amplify-lead-gen.yml                # Lead gen build spec
├── cloudformation/
│   ├── database.yml                    # RDS databases
│   ├── storage.yml                     # S3 and CloudFront
│   └── email.yml                       # SES configuration
└── terraform/
    ├── main.tf                         # Main Terraform config
    ├── variables.tf                    # Variable definitions
    ├── outputs.tf                      # Output definitions
    └── terraform.tfvars.example        # Example values

scripts/
├── setup-aws.sh                        # Infrastructure setup script
└── deploy-production.sh                # Deployment script

docs/
└── AWS_DEPLOYMENT.md                   # Complete deployment guide

apps/
├── rent-app/.env.production.example    # Rent app prod env template
└── lead-gen/.env.production.example    # Lead gen prod env template
```

---

**Deployment Status**: Ready for production deployment

**Last Updated**: January 4, 2026

**Maintained By**: Nivasesa Infrastructure Team
