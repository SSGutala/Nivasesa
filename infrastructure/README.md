# Nivasesa AWS Infrastructure

This directory contains all infrastructure-as-code (IaC) configurations for deploying Nivasesa to AWS.

## Directory Structure

```
infrastructure/
├── README.md                    # This file
├── amplify-rent-app.yml         # Amplify build spec for rent-app
├── amplify-lead-gen.yml         # Amplify build spec for lead-gen
├── cloudformation/              # AWS CloudFormation templates
│   ├── database.yml             # RDS PostgreSQL databases
│   ├── storage.yml              # S3 buckets and CloudFront
│   └── email.yml                # SES email configuration
└── terraform/                   # Terraform configurations (alternative)
    ├── main.tf                  # Main Terraform configuration
    ├── variables.tf             # Variable definitions
    ├── outputs.tf               # Output definitions
    ├── terraform.tfvars.example # Example variable values
    └── modules/                 # Terraform modules (to be created)
        ├── vpc/
        ├── rds/
        ├── storage/
        ├── email/
        └── amplify/
```

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
cd /path/to/nivasesa
chmod +x scripts/setup-aws.sh
./scripts/setup-aws.sh
```

The script will guide you through:
1. Choosing CloudFormation or Terraform
2. Creating SSL certificates
3. Deploying infrastructure
4. Configuring services

### Option 2: Manual Setup

See [AWS Deployment Guide](/docs/AWS_DEPLOYMENT.md) for detailed step-by-step instructions.

## Infrastructure Components

### 1. AWS Amplify (Hosting & CI/CD)

**Files**: `amplify-rent-app.yml`, `amplify-lead-gen.yml`

Two separate Amplify applications:
- **Rent App**: Main peer-to-peer housing platform
- **Lead Gen**: Realtor matching platform

Features:
- Automatic builds on git push
- Environment-specific deployments
- Custom domain support
- CDN distribution
- Server-side rendering (Next.js SSR)

**Configuration**:
```yaml
# Build phases
- preBuild: Install dependencies with pnpm
- build: Generate Prisma client, run Next.js build
# Security headers included
```

### 2. Amazon RDS (Database)

**Files**: `cloudformation/database.yml`, `terraform/modules/rds/`

Two PostgreSQL databases:
- `production-nivasesa-rent-app-db` (rentapp)
- `production-nivasesa-lead-gen-db` (leadgen)

Features:
- PostgreSQL 15.5
- Encrypted storage
- Automated backups (7-day retention)
- Multi-AZ (production only)
- CloudWatch logs enabled

**Configuration**:
- Instance class: `db.t3.micro` (dev) / `db.r6g.large` (prod)
- Storage: 20GB (expandable)
- Backup window: 3:00-4:00 AM UTC
- Maintenance window: Monday 4:00-5:00 AM UTC

### 3. Amazon S3 & CloudFront (Storage & CDN)

**Files**: `cloudformation/storage.yml`, `terraform/modules/storage/`

S3 buckets for asset storage:
- `production-nivasesa-rent-app-assets`
- `production-nivasesa-lead-gen-assets`

CloudFront distributions for fast delivery:
- `assets.nivasesa.com`
- `assets.leads.nivasesa.com`

Features:
- Encrypted storage (AES-256)
- Versioning enabled
- CORS configured
- Lifecycle policies (30-day old version cleanup)
- CloudFront with HTTP/2, compression

### 4. Amazon SES (Email)

**Files**: `cloudformation/email.yml`, `terraform/modules/email/`

Email configuration for both apps:
- Domain verification (DKIM)
- Configuration sets
- Bounce/complaint handling via SNS
- Reputation monitoring

**Email addresses**:
- `noreply@nivasesa.com` (rent-app)
- `noreply@leads.nivasesa.com` (lead-gen)

### 5. Secrets Manager

Stores sensitive configuration:
- Database credentials
- API keys
- OAuth secrets

Access via:
```bash
aws secretsmanager get-secret-value \
  --secret-id production/nivasesa/rent-app/database
```

### 6. CloudWatch (Monitoring)

Automatic log collection from:
- Amplify builds
- Application runtime
- Database
- CloudFront access logs

## Deployment Approaches

### CloudFormation (AWS Native)

**Pros**:
- Native AWS support
- No additional tools required
- Tight AWS integration
- Change sets for previewing changes

**Cons**:
- AWS-specific (vendor lock-in)
- YAML can be verbose
- Limited to AWS services

**Usage**:
```bash
# Deploy database stack
aws cloudformation create-stack \
  --stack-name production-nivasesa-database \
  --template-body file://cloudformation/database.yml \
  --parameters file://parameters.json

# Update stack
aws cloudformation update-stack \
  --stack-name production-nivasesa-database \
  --template-body file://cloudformation/database.yml

# Delete stack
aws cloudformation delete-stack \
  --stack-name production-nivasesa-database
```

### Terraform (Multi-Cloud)

**Pros**:
- Multi-cloud support
- State management
- Module reusability
- Better variable handling
- Plan preview

**Cons**:
- Additional tool to learn
- State file management
- AWS-specific features may lag

**Usage**:
```bash
cd terraform

# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy
```

## Environment Management

### Production

- Environment: `production`
- Region: `us-east-1`
- High availability: Multi-AZ RDS
- Domains: `nivasesa.com`, `leads.nivasesa.com`

### Staging

- Environment: `staging`
- Region: `us-east-1`
- Single-AZ for cost savings
- Domains: `staging.nivasesa.com`, `staging-leads.nivasesa.com`

### Development

- Local SQLite databases
- Local S3 (MinIO or LocalStack)
- Local email (Mailpit or similar)

## Cost Management

### Estimated Monthly Costs

**Production** (~$57/month):
- Amplify: $9
- RDS: $33
- S3: $0.30
- CloudFront: $9.50
- SES: $0.50
- Other: $5

**Staging** (~$35/month):
- Similar to production but:
  - Single-AZ RDS
  - Lower traffic volume
  - Reduced backup retention

### Cost Optimization

1. **Right-size instances**: Start with `db.t3.micro`, scale up as needed
2. **Reserved instances**: Save 40-60% with 1-3 year commitments
3. **S3 lifecycle**: Move old assets to Glacier
4. **CloudWatch logs**: Set retention policies
5. **Development**: Use local alternatives when possible

### Cost Monitoring

Set up budget alerts:
```bash
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget '{
    "BudgetName": "nivasesa-monthly",
    "BudgetLimit": {"Amount": "100", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }'
```

## Security

### Best Practices

1. **Encryption**
   - All data encrypted at rest (RDS, S3)
   - TLS/SSL for data in transit
   - Secrets in Secrets Manager

2. **Access Control**
   - IAM roles for service access
   - No hardcoded credentials
   - Least privilege principle

3. **Network Security**
   - VPC with private subnets for RDS
   - Security groups for controlled access
   - WAF for DDoS protection (optional)

4. **Monitoring**
   - CloudWatch alarms for anomalies
   - CloudTrail for audit logs
   - GuardDuty for threat detection (optional)

### Security Checklist

- [ ] All secrets in Secrets Manager
- [ ] Database in private subnet
- [ ] Security groups properly configured
- [ ] CloudWatch alarms set up
- [ ] SES in production mode (out of sandbox)
- [ ] SSL certificates validated
- [ ] IAM roles follow least privilege
- [ ] Regular security audits scheduled

## Disaster Recovery

### Backup Strategy

1. **Database**
   - Automated daily backups (7-day retention)
   - Manual snapshots before major changes
   - Cross-region backup (optional, for critical data)

2. **S3**
   - Versioning enabled
   - Cross-region replication (optional)

3. **Infrastructure**
   - IaC templates in git
   - CloudFormation/Terraform state backups

### Recovery Procedures

**Database Restoration**:
```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier new-instance \
  --db-snapshot-identifier snapshot-id
```

**Application Rollback**:
```bash
# Redeploy previous commit
aws amplify start-job \
  --app-id APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --commit-id PREVIOUS_COMMIT
```

**Infrastructure Recreation**:
```bash
# CloudFormation
aws cloudformation create-stack \
  --stack-name production-nivasesa-database \
  --template-body file://cloudformation/database.yml

# Terraform
terraform apply
```

## Maintenance

### Regular Tasks

**Weekly**:
- Review CloudWatch logs for errors
- Check database performance metrics
- Monitor costs

**Monthly**:
- Review and clean up old S3 versions
- Update dependencies in package.json
- Security patch review

**Quarterly**:
- Database backup testing
- Disaster recovery drill
- Cost optimization review
- Security audit

### Updates

**Updating Infrastructure**:
```bash
# CloudFormation
aws cloudformation update-stack \
  --stack-name production-nivasesa-database \
  --template-body file://cloudformation/database.yml

# Terraform
terraform plan
terraform apply
```

**Database Migrations**:
```bash
# Run migrations via Amplify build or manually
DATABASE_URL="..." npx prisma migrate deploy
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Amplify console for logs
   - Verify environment variables
   - Test build locally first

2. **Database Connection**
   - Check security group rules
   - Verify DATABASE_URL format
   - Test from Amplify environment

3. **Email Sending**
   - Check SES sandbox status
   - Verify domain DKIM records
   - Check bounce/complaint rates

4. **Performance**
   - Enable CloudFront caching
   - Optimize database queries
   - Scale RDS instance if needed

See [AWS Deployment Guide](/docs/AWS_DEPLOYMENT.md) for detailed troubleshooting.

## Additional Resources

- [AWS Deployment Guide](/docs/AWS_DEPLOYMENT.md) - Complete deployment instructions
- [Project README](/README.md) - Project overview
- [CLAUDE.md](/CLAUDE.md) - Development guidelines

### AWS Documentation

- [Amplify](https://docs.aws.amazon.com/amplify/)
- [RDS](https://docs.aws.amazon.com/rds/)
- [S3](https://docs.aws.amazon.com/s3/)
- [CloudFront](https://docs.aws.amazon.com/cloudfront/)
- [SES](https://docs.aws.amazon.com/ses/)

### Support

- AWS Support Console: https://console.aws.amazon.com/support
- Team Documentation: `/docs/`
- Infrastructure Issues: Tag `@infra` in Slack

## Contributing

When modifying infrastructure:

1. Test changes in staging first
2. Document all changes
3. Update this README if needed
4. Create CloudFormation change sets or Terraform plans
5. Review with team before applying to production
6. Monitor deployment closely

## License

Proprietary - Nivasesa Platform
