#!/bin/bash

KEYCLOAK_URL="$KEYCLOAK_HOST"
REALM="$KEYCLOAK_REALM"
CLIENT_ID="$KEYCLOAK_CLIENT_ID"
CLIENT_SECRET="$KEYCLOAK_CLIENT_SECRET"

IMPORT_DIR="/imports-files"

# Récupération du token d'accès
echo "Fetching access token..."
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_HOST/realms/$KEYCLOAK_REALM/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials" \
    -d "client_id=$KEYCLOAK_CLIENT_ID" \
    -d "client_secret=$KEYCLOAK_CLIENT_SECRET")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "Error: Failed to fetch access token. Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "Access token acquired successfully."
CLIENT_UUID=$(curl -s -X GET "$KEYCLOAK_HOST/admin/realms/$REALM/clients" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
   | jq -r ".[] | select(.clientId == \"$CLIENT_ID\") | .id")
echo $CLIENT_UUID

# Vérifiez si l'UUID du client a été trouvé
if [ -z "$CLIENT_UUID" ]; then
  echo "Client avec clientId '$CLIENT_ID' non trouvé."
  exit 1
fi

echo "L'UUID du client '$CLIENT_ID' est : $CLIENT_UUID"
# Importer les fichiers JSON
for file in $IMPORT_DIR/*.json; do
  if [ -f "$file" ]; then
    echo "Importing $file..."
    echo "Keycloak Host: $KEYCLOAK_HOST"
    echo "Realm: $REALM"

    if [[ "$file" = *"001-roles.json"* ]]; then
      cat $file | jq -c '.[]' | while read role; do
        ROLE_NAME=$(echo $role | jq -r '.name')
        ROLE_DESCRIPTION=$(echo $role | jq -r '.description')

        echo "Role JSON: { \"name\": \"$ROLE_NAME\", \"description\": \"$ROLE_DESCRIPTION\" }"

        RESPONSE=$(curl -v -s -X POST "${KEYCLOAK_HOST}admin/realms/$REALM/roles" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -d @- <<EOF
{
  "name": "$ROLE_NAME",
  "description": "$ROLE_DESCRIPTION"
}
EOF
)
      done
      ENDPOINT="roles"
    elif [[ "$file" = *"keycloak_privileges.json"* ]]; then
      RESPONSE=$(curl -v -s -o /dev/null -w "%{http_code}" -X POST "${KEYCLOAK_HOST}auth/admin/realms/$REALM/clients" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -d @$file)
      ENDPOINT="clients"
    else
      echo "Unknown file type: $file. Skipping..."
      continue
    fi

    if [ "$RESPONSE" -eq 201 ]; then
        echo "Successfully imported $file to $ENDPOINT."
    else
        echo "Failed to import $file to $ENDPOINT"
    fi
  else
    echo "No JSON files found in directory $IMPORT_DIR."
    break
  fi
done
