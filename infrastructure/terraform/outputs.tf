output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "rent_app_db_endpoint" {
  description = "Rent App database endpoint"
  value       = module.rds.rent_app_endpoint
}

output "lead_gen_db_endpoint" {
  description = "Lead Gen database endpoint"
  value       = module.rds.lead_gen_endpoint
}

output "rent_app_db_connection_string" {
  description = "Rent App database connection string"
  value       = module.rds.rent_app_connection_string
  sensitive   = true
}

output "lead_gen_db_connection_string" {
  description = "Lead Gen database connection string"
  value       = module.rds.lead_gen_connection_string
  sensitive   = true
}

output "rent_app_s3_bucket" {
  description = "S3 bucket for rent-app assets"
  value       = module.storage.rent_app_assets_bucket
}

output "lead_gen_s3_bucket" {
  description = "S3 bucket for lead-gen assets"
  value       = module.storage.lead_gen_assets_bucket
}

output "rent_app_cdn_domain" {
  description = "CloudFront domain for rent-app assets"
  value       = module.storage.rent_app_cdn_domain
}

output "lead_gen_cdn_domain" {
  description = "CloudFront domain for lead-gen assets"
  value       = module.storage.lead_gen_cdn_domain
}

output "rent_app_amplify_app_id" {
  description = "Amplify App ID for rent-app"
  value       = module.amplify.rent_app_app_id
}

output "lead_gen_amplify_app_id" {
  description = "Amplify App ID for lead-gen"
  value       = module.amplify.lead_gen_app_id
}

output "rent_app_amplify_url" {
  description = "Amplify default domain for rent-app"
  value       = module.amplify.rent_app_default_domain
}

output "lead_gen_amplify_url" {
  description = "Amplify default domain for lead-gen"
  value       = module.amplify.lead_gen_default_domain
}

output "ses_configuration_sets" {
  description = "SES configuration set names"
  value = {
    rent_app = module.email.rent_app_config_set
    lead_gen = module.email.lead_gen_config_set
  }
}
