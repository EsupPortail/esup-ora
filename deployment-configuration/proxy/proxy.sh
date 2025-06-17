#!/bin/sh

# Nom du fichier .env à lire
ENV_FILE=".env_proxy"

# Vérifier si le fichier .env existe
if [ -f "$ENV_FILE" ]; then
  # Lire le fichier .env ligne par ligne
  while IFS= read -r line; do
    # Vérifier si la ligne contient une variable http_proxy
    if [ "${line%%=*}" = "http_proxy" ]; then
      # Extraire la valeur de http_proxy
      http_proxy_value="${line#*=}"
      # Définir la variable d'environnement http_proxy
      export http_proxy="$http_proxy_value"
      echo "Set http_proxy : $http_proxy"
    fi

    # Vérifier si la ligne contient une variable https_proxy
    if [ "${line%%=*}" = "https_proxy" ]; then
      # Extraire la valeur de https_proxy
      https_proxy_value="${line#*=}"
      # Définir la variable d'environnement https_proxy
      export https_proxy="$https_proxy_value"
      echo "Set https_proxy : $https_proxy"
    fi
  done < "$ENV_FILE"
else
  echo "Le fichier $ENV_FILE n'existe pas."
fi