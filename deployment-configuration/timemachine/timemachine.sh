#!/bin/bash

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <database_name> <dump_prefix> <database_user> <database_password>"
  exit 1
fi

# Paramètres d'entrée
INPUT_DB_NAME="$1"
DUMP_PREFIX="$2"
INPUT_USER="$3"
INPUT_PSWD="$4"
# Nom du fichier de dump
DUMP_FILE="${DUMP_PREFIX}-db_backup_$(date +%Y-%m-%d_%H-%M-%S).sql"

echo ${DUMP_FILE}
pg_dump --dbname="postgresql://$INPUT_USER:$INPUT_PSWD@$DATABASE_HOST:$DATABASE_PORT/$INPUT_DB_NAME" > "/timemachine/${DUMP_FILE}"
python3 /upload-dump-database-s3.py /timemachine/${DUMP_FILE} ${DUMP_FILE}