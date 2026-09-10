output "service_url" { value = google_cloud_run_v2_service.app.uri }
output "cloud_sql_connection_name" { value = google_sql_database_instance.app.connection_name }
