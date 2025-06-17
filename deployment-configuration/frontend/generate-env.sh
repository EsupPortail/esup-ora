#!/bin/bash

# Chemin du fichier .env
SOURCE_ENV_FILE="/.env"
DEST_ENV_FILE="/app/.env"

# Variables à extraire
neededVars=("DEPLOYMENT_MODE" "SERVER_NAME")

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