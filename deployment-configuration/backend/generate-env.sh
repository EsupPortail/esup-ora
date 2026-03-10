#!/bin/bash

SOURCE="/.env"
DEST="/app/.env"

echo "Démarrage de l'extraction des variables..."

if [ ! -f "$SOURCE" ]; then
    echo "ERREUR : Le fichier source $SOURCE est introuvable !"
    exit 1
fi

neededVars=("RNCP_URL" "RNCP_CLIENT_ID" "RNCP_CLIENT_SECRET" "SOCKET_ORIGIN" "COOKIE_DOMAIN" "ORA_DATABASE_SECURITY_NAME" "ORA_DATABASE_URL" "SESSION_SECRET" "BACKEND_HOST" "NODE_ENV" "FRONTEND_URL" "ALLOW_ORIGIN" "CORS_ORIGIN" "FRONTEND_PORT" "FRONTEND_LOGIN_PAGE" "DEPLOYMENT_MODE" "SERVER_NAME" "DATABASE_HOST" "DATABASE_PORT" "ORA_DATABASE_NAME" "ORA_DATABASE_USER" "ORA_DATABASE_PSWD" "SHIB_SP_ENTITYID" "SHIB_SP_URL" "WAYF_SP_HANDLERURL" "WAYF_RETURN_URL" "WAYF_SHOW_REMEMBER_CHECKBOX" "WAYF_USE_IMPROVED_DROP_DOWN_LIST" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "AWS_BUCKET_NAME" "AWS_DEFAULT_REGION" "AWS_ENDPOINT" "AWS_PROFILE" "KEYCLOAK_HOST" "KEYCLOAK_REALM" "KEYCLOAK_CLIENT_ID" "KEYCLOAK_CLIENT_SECRET")

> "$DEST"

for var in "${neededVars[@]}"; do
    value=$(grep "^${var}=" "$SOURCE" | tr -d '\r')
    if [ -n "$value" ]; then
        echo "$value" >> "$DEST"
    else
        echo "ATTENTION : $var non trouvée dans $SOURCE"
    fi
done

echo "Extraction terminée. Nombre de lignes écrites : $(wc -l < "$DEST")"