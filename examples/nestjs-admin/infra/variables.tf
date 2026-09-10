variable "project_id" { type = string }
variable "region" {
  type    = string
  default = "us-central1"
}
variable "service_name" {
  type    = string
  default = "nestjs-admin-sample"
}
variable "container_image" {
  type        = string
  description = "Immutable Artifact Registry image reference built from this sample."
}
variable "database_tier" {
  type    = string
  default = "db-f1-micro"
}
