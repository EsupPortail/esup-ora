#!/bin/bash

# Chemin du fichier .env
SOURCE_ENV_FILE="/.env"
DEST_ENV_FILE="/app/.env"

# Variables à extraire
neededVars=("SOCKET_ORIGIN" "COOKIE_DOMAIN" "ORA_DATABASE_SECURITY_NAME" "ORA_DATABASE_URL" "SESSION_SECRET" "BACKEND_HOST" "NODE_ENV" "FRONTEND_URL" "ALLOW_ORIGIN" "CORS_ORIGIN" "FRONTEND_PORT" "FRONTEND_LOGIN_PAGE" "DEPLOYMENT_MODE" "SERVER_NAME" "DATABASE_HOST" "DATABASE_PORT" "ORA_DATABASE_NAME" "ORA_DATABASE_USER" "ORA_DATABASE_PSWD" "ORA_DATABASE_URL" "SHIB_SP_ENTITYID" "SHIB_SP_URL" "WAYF_SP_HANDLERURL" "WAYF_RETURN_URL" "WAYF_SHOW_REMEMBER_CHECKBOX" "WAYF_USE_IMPROVED_DROP_DOWN_LIST" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "AWS_BUCKET_NAME" "AWS_DEFAULT_REGION" "AWS_ENDPOINT" "AWS_PROFILE" "KEYCLOAK_HOST" "KEYCLOAK_REALM" "KEYCLOAK_CLIENT_ID" "KEYCLOAK_CLIENT_SECRET")

# Vérifier si le fichier de destination existe déjà, et le supprimer
if [ -f "$DEST_ENV_FILE" ]; then
  rm "$DEST_ENV_FILE"
fi

# Lire le fichier source .env et extraire les variables spécifiées
while IFS= read -r line; do
  for var in "${neededVars[@]}"; do
    if [[ $line == $var=* ]]; then
      echo "$line" >> "$DEST_ENV_FILE"
    fi
  done
done < "$SOURCE_ENV_FILE"

echo "Les variables spécifiées ont été extraites et écrites dans $DEST_ENV_FILE"