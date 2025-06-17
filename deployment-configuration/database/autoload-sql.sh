#!/bin/sh

# Démarrer PostgreSQL en arrière-plan
postgres &

# Variables administrateur
administrator_user="$DATABASE_SUPERADMIN_USERNAME"
administrator_pswd="$DATABASE_SUPERADMIN_PASSWORD"

# Attendre que PostgreSQL démarre correctement
until pg_isready -U "$administrator_user"; do
  echo "Attente du démarrage de PostgreSQL..."
  sleep 2
done

# Création des utilisateurs et bases de données Keycloak
echo "Création de l'utilisateur Keycloak... $IAM_DATABASE_USER"
psql -U "$administrator_user" -d "postgres" -c "CREATE USER $IAM_DATABASE_USER WITH PASSWORD '$IAM_DATABASE_PSWD';" ||true 
psql -U "$administrator_user" -d "postgres" -c "CREATE DATABASE $IAM_DATABASE_NAME WITH OWNER = $IAM_DATABASE_USER ENCODING = 'UTF8';" ||true

# Création des utilisateurs et bases de données ORA
echo "Création de l'utilisateur ORA... $ORA_DATABASE_USER"
psql -U "$administrator_user" -d "postgres" -c "CREATE USER $ORA_DATABASE_USER WITH PASSWORD '$ORA_DATABASE_PSWD';" ||true
psql -U "$administrator_user" -d "postgres" -c "CREATE DATABASE $ORA_DATABASE_NAME WITH OWNER = $ORA_DATABASE_USER ENCODING = 'UTF8';" ||true

# Création de la base de données pour stocker les informations d'authentification et de session
# Autrement c'est écrasé par le schéma prisma lors des migrations
psql -U "$administrator_user" -d "postgres" -c "CREATE DATABASE $ORA_DATABASE_SECURITY_NAME WITH OWNER = $ORA_DATABASE_USER ENCODING = 'UTF8';" ||true

# Donner les accès à l'utilisateur Drowberry
echo "Configuration des permissions pour $ORA_DATABASE_USER sur $ORA_DATABASE_NAME..."
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $ORA_DATABASE_USER;" ||true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "GRANT CREATE ON SCHEMA public TO $ORA_DATABASE_USER;" || true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "GRANT CONNECT ON DATABASE $ORA_DATABASE_NAME TO $ORA_DATABASE_USER;" || true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO $ORA_DATABASE_USER;" ||true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $ORA_DATABASE_USER;" ||true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO $ORA_DATABASE_USER;" ||true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "ALTER ROLE $ORA_DATABASE_USER CREATEDB;" ||true
psql -U "$administrator_user" -d "$ORA_DATABASE_NAME" -c "ALTER USER $ORA_DATABASE_USER WITH SUPERUSER;" ||true

# TODO : ERROR : ora_database  | psql: error: /scripts_to_init/*.sql: No such file or directory
# Boucle pour exécuter tous les fichiers SQL dans le répertoire

# Répertoire contenant les scripts SQL à exécuter
sql_scripts_dir="/initialization-scripts"

# Options pour psql
psql_options="-U $ORA_DATABASE_USER -d $ORA_DATABASE_NAME -a -v ON_ERROR_STOP=1"

# echo "Creation des tables complementaires dans la base de données securite..."
# for file in "$sql_scripts_dir"/*.sql; do
#   echo "Exécution du script SQL : $file"
#   psql $psql_options -f "$file"
# done

echo "Initialisation terminée."
