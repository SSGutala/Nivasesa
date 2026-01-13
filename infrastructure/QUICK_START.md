# AWS Infrastructure Quick Start

Get Nivasesa deployed to AWS in under 30 minutes.

## Prerequisites Checklist

- [ ] AWS account created
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Domain name purchased (e.g., nivasesa.com)
- [ ] GitHub repository ready
- [ ] Local development working

## Step-by-Step Deployment

### 1. Install Required Tools (5 minutes)

```bash
# Install AWS CLI
brew install awscli  # macOS
# or follow: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json

# Verify
aws sts get-caller-identity
```

### 2. Create SSL Certificate (5 minutes + validation time)

```bash
# Request certificate in us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name nivasesa.com \
  --subject-alternative-names "*.nivasesa.com" "leads.nivasesa.com" \
  --validation-method DNS \
  --region us-east-1

# Get certificate ARN
aws acm list-certificates --region us-east-1

# Add DNS validation records (check email or ACM console)
# Wait for validation to complete
```

### 3. Run Setup Script (15 minutes)

```bash
cd nivasesa
./scripts/setup-aws.sh
```

Follow the prompts:
- Choose CloudFormation (easier) or Terraform
- Enter environment: `production`
- Enter domains: `nivasesa.com`, `leads.nivasesa.com`
- Enter admin email
- Paste ACM certificate ARN

The script will:
- Create RDS databases (2)
- Create S3 buckets (2)
- Set up CloudFront distributions (2)
- Configure SES for email
- Generate secure passwords

**Save the output!** You'll need:
- Database connection strings
- S3 bucket names
- CloudFront domains

### 4. Set Up GitHub & Amplify (10 minutes)

#### 4a. Create GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `admin:repo_hook`
4. Copy token

#### 4b. Create Amplify Apps

**Rent App**:
```bash
# Create app
aws amplify create-app \
  --name "Nivasesa-Rent-App" \
  --repository "https://github.com/YOUR_ORG/nivasesa" \
  --platform WEB \
  --oauth-token YOUR_GITHUB_TOKEN

# Get app ID
RENT_APP_ID=$(aws amplify list-apps --query "apps[?name=='Nivasesa-Rent-App'].appId" --output text)
echo "Rent App ID: $RENT_APP_ID"

# Create main branch
aws amplify create-branch \
  --app-id $RENT_APP_ID \
  --branch-name main \
  --framework "Next.js - SSR"
```

**Lead Gen App**:
```bash
# Create app
aws amplify create-app \
  --name "Nivasesa-Lead-Gen" \
  --repository "https://github.com/YOUR_ORG/nivasesa" \
  --platform WEB \
  --oauth-token YOUR_GITHUB_TOKEN

# Get app ID
LEAD_GEN_APP_ID=$(aws amplify list-apps --query "apps[?name=='Nivasesa-Lead-Gen'].appId" --output text)
echo "Lead Gen App ID: $LEAD_GEN_APP_ID"

# Create main branch
aws amplify create-branch \
  --app-id $LEAD_GEN_APP_ID \
  --branch-name main \
  --framework "Next.js - SSR"
```

### 5. Configure Environment Variables (5 minutes)

Go to AWS Amplify Console for each app and add environment variables:

**Rent App** (https://console.aws.amazon.com/amplify):

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/rentapp
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://nivasesa.com
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
AWS_REGION=us-east-1
AWS_S3_BUCKET=production-nivasesa-rent-app-assets
AWS_SES_FROM_EMAIL=noreply@nivasesa.com
LAUNCHED=true
NODE_ENV=production

# Optional but recommended
GITHUB_ID=<from GitHub OAuth Apps>
GITHUB_SECRET=<from GitHub OAuth Apps>
```

**Lead Gen App**:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/leadgen
AUTH_SECRET=<generate different secret>
NEXTAUTH_URL=https://leads.nivasesa.com
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
AWS_REGION=us-east-1
AWS_S3_BUCKET=production-nivasesa-lead-gen-assets
AWS_SES_FROM_EMAIL=noreply@leads.nivasesa.com
LAUNCHED=true
NODE_ENV=production
```

### 6. Configure Build Settings

For each Amplify app:

1. Go to Build settings
2. Replace with contents from:
   - Rent App: `infrastructure/amplify-rent-app.yml`
   - Lead Gen: `infrastructure/amplify-lead-gen.yml`

### 7. Deploy Applications (5 minutes)

```bash
# Deploy both apps
./scripts/deploy-production.sh
```

Or manually trigger builds in Amplify Console.

### 8. Configure DNS (5 minutes)

Add these DNS records to your domain registrar:

#### For nivasesa.com

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | main.xxxxx.amplifyapp.com |
| CNAME | www | main.xxxxx.amplifyapp.com |
| CNAME | assets | xxxxx.cloudfront.net |

#### For leads.nivasesa.com

| Type | Name | Value |
|------|------|-------|
| CNAME | leads | main.xxxxx.amplifyapp.com |
| CNAME | assets.leads | xxxxx.cloudfront.net |

Get exact values from:
- Amplify Console > Domain management
- CloudFormation/Terraform outputs

### 9. Verify SES (5 minutes)

**Remove from SES Sandbox**:

1. Go to SES Console
2. Click "Request production access"
3. Fill out form (describe use case)
4. Wait for approval (usually 24 hours)

**Verify DKIM**:

```bash
# Get DKIM records
aws ses get-identity-dkim-attributes \
  --identities nivasesa.com leads.nivasesa.com

# Add DKIM TXT records to your DNS
```

### 10. Test Deployment (5 minutes)

```bash
# Test rent-app
curl -I https://nivasesa.com
# Should return 200 OK

# Test lead-gen
curl -I https://leads.nivasesa.com
# Should return 200 OK

# Test database connection
# Check application logs in CloudWatch
aws logs tail /aws/amplify/$RENT_APP_ID/main --follow
```

## Verification Checklist

After deployment, verify:

- [ ] Rent app accessible at https://nivasesa.com
- [ ] Lead gen accessible at https://leads.nivasesa.com
- [ ] SSL certificates working (no browser warnings)
- [ ] Database connections working (check logs)
- [ ] File uploads to S3 working
- [ ] Email sending working (test forgot password)
- [ ] Authentication working (test login)
- [ ] Payment processing working (test with Stripe test mode first)

## Common Issues

### Issue: Build Fails

**Solution**:
```bash
# Check build logs
aws amplify list-jobs --app-id $RENT_APP_ID --branch-name main

# Common fixes:
# 1. Missing environment variables
# 2. Wrong DATABASE_URL format
# 3. pnpm-lock.yaml not committed
```

### Issue: "Cannot connect to database"

**Solution**:
```bash
# Check security group allows connections from 0.0.0.0/0
# Or whitelist Amplify IP ranges
# Verify DATABASE_URL is correct (check for URL encoding)
```

### Issue: Emails not sending

**Solution**:
```bash
# Check if still in SES sandbox
aws ses get-account-sending-enabled

# If in sandbox, verify recipient email addresses
aws ses verify-email-identity --email-address test@example.com
```

### Issue: 404 on custom domain

**Solution**:
```bash
# Wait for DNS propagation (can take up to 48 hours)
# Check DNS with:
dig nivasesa.com

# Verify domain in Amplify Console > Domain management
```

## Next Steps

After deployment:

1. **Monitor**: Set up CloudWatch alarms
   ```bash
   # High error rate
   aws cloudwatch put-metric-alarm \
     --alarm-name rent-app-errors \
     --metric-name 5xxErrors \
     --namespace AWS/AmplifyHosting \
     --threshold 10
   ```

2. **Backup**: Create manual database snapshot
   ```bash
   aws rds create-db-snapshot \
     --db-instance-identifier production-nivasesa-rent-app-db \
     --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
   ```

3. **Security**: Enable WAF (optional but recommended)
4. **Performance**: Configure caching headers
5. **Analytics**: Set up Google Analytics or similar

## Cost Optimization

For first month:
- Use `db.t3.micro` instances (~$13/month each)
- Enable S3 Intelligent-Tiering
- Set CloudWatch log retention to 7 days
- **Total: ~$30-40/month**

## Support

- Full guide: `/docs/AWS_DEPLOYMENT.md`
- Infrastructure docs: `/infrastructure/README.md`
- AWS Console: https://console.aws.amazon.com
- Get help: AWS Support or team Slack

## Rollback

If deployment fails:

```bash
# Rollback Amplify
aws amplify start-job \
  --app-id $RENT_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --commit-id PREVIOUS_COMMIT_HASH

# Restore database
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier production-nivasesa-rent-app-db-restored \
  --db-snapshot-identifier snapshot-id

# Delete CloudFormation stacks
aws cloudformation delete-stack --stack-name production-nivasesa-database
aws cloudformation delete-stack --stack-name production-nivasesa-storage
aws cloudformation delete-stack --stack-name production-nivasesa-email
```

---

**Congratulations!** Your Nivasesa platform is now live on AWS.

For detailed documentation, see [AWS_DEPLOYMENT.md](/docs/AWS_DEPLOYMENT.md).
