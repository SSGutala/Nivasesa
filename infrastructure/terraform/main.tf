terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment and configure for production
  # backend "s3" {
  #   bucket         = "nivasesa-terraform-state"
  #   key            = "production/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "nivasesa-terraform-lock"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Nivasesa"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Provider for us-east-1 (required for CloudFront certificates)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "Nivasesa"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  environment          = var.environment
  vpc_id               = module.vpc.vpc_id
  private_subnet_ids   = module.vpc.private_subnet_ids
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_master_username   = var.db_master_username
  db_master_password   = var.db_master_password
}

# S3 and CloudFront Module
module "storage" {
  source = "./modules/storage"

  environment           = var.environment
  rent_app_domain       = var.rent_app_domain
  lead_gen_domain       = var.lead_gen_domain
  acm_certificate_arn   = var.acm_certificate_arn
}

# SES Module
module "email" {
  source = "./modules/email"

  environment       = var.environment
  rent_app_domain   = var.rent_app_domain
  lead_gen_domain   = var.lead_gen_domain
  admin_email       = var.admin_email
}

# Amplify Module
module "amplify" {
  source = "./modules/amplify"

  environment                = var.environment
  rent_app_domain            = var.rent_app_domain
  lead_gen_domain            = var.lead_gen_domain
  github_repository          = var.github_repository
  github_access_token        = var.github_access_token

  # Database outputs
  rent_app_db_url            = module.rds.rent_app_connection_string
  lead_gen_db_url            = module.rds.lead_gen_connection_string

  # S3 outputs
  rent_app_s3_bucket         = module.storage.rent_app_assets_bucket
  lead_gen_s3_bucket         = module.storage.lead_gen_assets_bucket

  # SES outputs
  ses_region                 = data.aws_region.current.name
  rent_app_ses_from_email    = module.email.rent_app_from_email
  lead_gen_ses_from_email    = module.email.lead_gen_from_email
}

# Route53 Module (optional - uncomment if using Route53)
# module "dns" {
#   source = "./modules/route53"
#
#   environment                     = var.environment
#   rent_app_domain                 = var.rent_app_domain
#   lead_gen_domain                 = var.lead_gen_domain
#   rent_app_amplify_default_domain = module.amplify.rent_app_default_domain
#   lead_gen_amplify_default_domain = module.amplify.lead_gen_default_domain
#   rent_app_cdn_domain             = module.storage.rent_app_cdn_domain
#   lead_gen_cdn_domain             = module.storage.lead_gen_cdn_domain
# }
