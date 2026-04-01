#!/usr/bin/env bash
set -euo pipefail

KEYCLOAK_URL=${KEYCLOAK_URL:-"http://localhost:8080"}
KEYCLOAK_REALM="RealmORA"

declare -A ROLES_HIERARCHY=(
  ["observateur"]=1
  ["enseignant"]=2
  ["agent_scolarite"]=3
  ["ingenieur_pedagogique"]=4
  ["directeur_composante"]=5
  ["administrateur_fonctionnel"]=6
  ["administrateur_technique"]=7
)

echo "🔐 Authenticating to Keycloak..."
../bin/kcadm.sh config credentials \
  --server "$KEYCLOAK_URL" \
  --realm master \
  --user "$KEYCLOAK_ADMIN" \
  --password "$KEYCLOAK_ADMIN_PASSWORD"

echo "✅ Authenticated successfully"

echo "Disabling SSL Requirements for realm '$KEYCLOAK_REALM'..."
../bin/kcadm.sh update realms/master -s sslRequired=NONE --server "$KEYCLOAK_URL"

echo "Patching roles hierarchy..."

# Patch roles
for ROLE in "${!ROLES_HIERARCHY[@]}"; do
  LEVEL="${ROLES_HIERARCHY[$ROLE]}"
  echo "→ Processing role '$ROLE'"

  # Vérifie si le rôle existe
  ROLE_ID=$(../bin/kcadm.sh get "roles/$ROLE" -r "$KEYCLOAK_REALM" --fields id --format csv || echo "")

  if [ -z "$ROLE_ID" ]; then
    echo "⚠ Role '$ROLE' does not exist → creating it"

    # Spécifique pour agent_scolarite
    if [ "$ROLE" == "agent_scolarite" ]; then
      ../bin/kcadm.sh create roles -r "$KEYCLOAK_REALM" -s "name=$ROLE" \
        -s 'description=Rôle associé à un gestionnaire de scolarité pour la gestion des formations et des rattachements' \
        -s "clientRole=false" \
        -s "composite=false" \
        -s 'attributes.display_name=["Gestionnaire de scolarité"]' \
        -s 'attributes.ora-roles=["true"]'
    # Spécifique pour directeur_composante
    elif [ "$ROLE" == "directeur_composante" ]; then
      ../bin/kcadm.sh create roles -r "$KEYCLOAK_REALM" -s "name=$ROLE" \
        -s 'description=Rôle associé à un directeur de composante pour la supervision de sa structure' \
        -s "clientRole=false" \
        -s "composite=false" \
        -s 'attributes.display_name=["Directeur de composante"]' \
        -s 'attributes.ora-roles=["true"]'
    else
      # Crée un rôle simple pour les autres
      ../bin/kcadm.sh create roles -r "$KEYCLOAK_REALM" -s "name=$ROLE"
    fi
    ROLE_ID=$(../bin/kcadm.sh get "roles/$ROLE" -r "$KEYCLOAK_REALM" --fields id --format csv)
  fi

  echo "→ Updating role attributes for '$ROLE'"

  # Patch les attributs hiérarchie et display_name si nécessaire
  if [ "$ROLE" == "agent_scolarite" ]; then
    ../bin/kcadm.sh update "roles/$ROLE" -r "$KEYCLOAK_REALM" \
      -s "attributes.hierarchy=[\"$LEVEL\"]" \
      -s 'attributes.display_name=["Gestionnaire de scolarité"]' \
      -s 'attributes.ora-roles=["true"]'
  elif [ "$ROLE" == "directeur_composante" ]; then
    ../bin/kcadm.sh update "roles/$ROLE" -r "$KEYCLOAK_REALM" \
      -s "attributes.hierarchy=[\"$LEVEL\"]" \
      -s 'attributes.display_name=["Directeur de composante"]' \
      -s 'attributes.ora-roles=["true"]'
  else
    ../bin/kcadm.sh update "roles/$ROLE" -r "$KEYCLOAK_REALM" \
      -s "attributes.hierarchy=[\"$LEVEL\"]"
  fi
done

echo "✅ Roles patched successfully"