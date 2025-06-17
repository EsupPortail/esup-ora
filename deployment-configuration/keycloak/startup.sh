#!/bin/bash

KEYCLOAK_URL="${KEYCLOAK_HOST}health/ready"
MAX_RETRIES=20
RETRY_INTERVAL=15

# Wait for Keycloak to be ready (healthcheck)
echo "Waiting for Keycloak to be ready..."
retries=0
while true; do
  # Vérification du healthcheck
  if curl -s -f "$KEYCLOAK_URL"; then
    echo "Keycloak is ready."
    break
  else
    retries=$((retries + 1))
    if [ "$retries" -ge "$MAX_RETRIES" ]; then
      echo "Keycloak did not become ready in time. Exiting."
      exit 1
    fi
    echo "Keycloak is not ready yet. Retrying in $RETRY_INTERVAL seconds..."
    sleep $RETRY_INTERVAL
  fi
done

echo "Granting permissions to scripts..."
chmod +x /inject-configuration.sh &&
chmod +x /generate-privileges-prisma.sh &&
echo "Done"
echo "Generating privileges based on prisma model..."
/generate-privileges-prisma.sh
echo "Done"
cp /keycloak_privileges.json /imports-files
echo "Injecting all configuration into Keycloak..."
/inject-configuration.sh
echo "Initialization completed."

while true; do
  echo "Staying alive... for development"
  sleep 30
done