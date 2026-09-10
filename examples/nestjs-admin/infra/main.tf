locals {
  required_services = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com"
  ])
}

resource "google_project_service" "required" {
  for_each           = local.required_services
  service            = each.value
  disable_on_destroy = false
}

resource "google_service_account" "app" {
  account_id   = "${var.service_name}-runtime"
  display_name = "NestJS admin sample runtime"
}

resource "google_sql_database_instance" "app" {
  name             = "${var.service_name}-pg"
  region           = var.region
  database_version = "POSTGRES_18"
  deletion_protection = true

  settings {
    tier              = var.database_tier
    availability_type = "ZONAL"
    disk_autoresize   = true
    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_sql_database" "app" {
  name     = "admin"
  instance = google_sql_database_instance.app.name
}

resource "random_password" "database" {
  length  = 32
  special = false
}

resource "google_sql_user" "app" {
  name     = "admin_app"
  instance = google_sql_database_instance.app.name
  password = random_password.database.result
}

resource "google_secret_manager_secret" "database_password" {
  secret_id = "${var.service_name}-database-password"
  replication { auto {} }
  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret_version" "database_password" {
  secret      = google_secret_manager_secret.database_password.id
  secret_data = random_password.database.result
}

resource "google_project_iam_member" "cloud_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.app.email}"
}

resource "google_secret_manager_secret_iam_member" "database_password" {
  secret_id = google_secret_manager_secret.database_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app.email}"
}

resource "google_cloud_run_v2_service" "app" {
  name                = var.service_name
  location            = var.region
  deletion_protection = true
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.app.email
    timeout         = "30s"
    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }

    containers {
      image = var.container_image
      ports { container_port = 8080 }
      resources {
        limits = { cpu = "1", memory = "512Mi" }
        cpu_idle = true
      }
      env { name = "NODE_ENV" value = "production" }
      env { name = "DATABASE_MODE" value = "prisma" }
      env { name = "DB_USER" value = google_sql_user.app.name }
      env { name = "DB_NAME" value = google_sql_database.app.name }
      env { name = "DB_SOCKET_PATH" value = "/cloudsql/${google_sql_database_instance.app.connection_name}" }
      env { name = "DB_POOL_MAX" value = "5" }
      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_password.secret_id
            version = google_secret_manager_secret_version.database_password.version
          }
        }
      }
      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
      startup_probe {
        http_get { path = "/health/live" port = 8080 }
        initial_delay_seconds = 1
        timeout_seconds       = 2
        period_seconds        = 3
        failure_threshold     = 10
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.app.connection_name]
      }
    }
  }

  depends_on = [
    google_project_iam_member.cloud_sql_client,
    google_secret_manager_secret_iam_member.database_password
  ]
}
