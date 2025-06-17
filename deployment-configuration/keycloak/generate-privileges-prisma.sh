#!/bin/bash

# Configuration
DB_NAME="$ORA_DATABASE_NAME"
DB_USER="$ORA_DATABASE_USER"
DB_PASSWORD="$ORA_DATABASE_PSWD"
DB_HOST="$DATABASE_HOST"
DB_PORT="$DATABASE_PORT"
OUTPUT_FILE="keycloak_privileges.json"
NAMESPACE_ID=1
NAMESPACE_LABEL="CRUD resources"
ORDER_COUNTER_START=10

# Initialize JSON structure
echo "{" > "$OUTPUT_FILE"
echo "  \"client_id\": \"your-client-id\"," >> "$OUTPUT_FILE"
echo "  \"resources\": [" >> "$OUTPUT_FILE"

ORDER_COUNTER=$ORDER_COUNTER_START
FIRST_ENTRY=true

# Fetch table names and filter them
TABLES=$(psql $ORA_DATABASE_URL -tAc \
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE '%prisma%' AND table_name NOT LIKE '\\_%' ESCAPE '\\';")

for TABLE in $TABLES; do
  # Generate category and privileges JSON
  CATEGORY_ID=$((ORDER_COUNTER / 10))
  
  if [ "$FIRST_ENTRY" = true ]; then
    FIRST_ENTRY=false
  else
    echo "," >> "$OUTPUT_FILE"
  fi

  # Define the resource for each table
  RESOURCE_NAME="rncp-resource-$TABLE"
  
  echo "    {" >> "$OUTPUT_FILE"
  echo "      \"name\": \"$RESOURCE_NAME\"," >> "$OUTPUT_FILE"
  echo "      \"type\": \"resource\"," >> "$OUTPUT_FILE"
  echo "      \"attributes\": {\"name\": \"$TABLE\"}," >> "$OUTPUT_FILE"
  echo "      \"permissions\": [" >> "$OUTPUT_FILE"
  
  # Define each permission for the table
  echo "        {\"name\": \"creer_$TABLE\", \"description\": \"Créer la resource $TABLE\", \"scope\": \"create\", \"resource_name\": \"$RESOURCE_NAME\", \"roles\": [\"admin\", \"editor\"], \"action\": \"create\"}," >> "$OUTPUT_FILE"
  echo "        {\"name\": \"consulter_$TABLE\", \"description\": \"Consulter la resource $TABLE\", \"scope\": \"read\", \"resource_name\": \"$RESOURCE_NAME\", \"roles\": [\"admin\", \"viewer\"], \"action\": \"view\"}," >> "$OUTPUT_FILE"
  echo "        {\"name\": \"modifier_$TABLE\", \"description\": \"Modifier la resource $TABLE\", \"scope\": \"write\", \"resource_name\": \"$RESOURCE_NAME\", \"roles\": [\"admin\", \"editor\"], \"action\": \"update\"}," >> "$OUTPUT_FILE"
  echo "        {\"name\": \"supprimer_$TABLE\", \"description\": \"Supprimer la resource $TABLE\", \"scope\": \"delete\", \"resource_name\": \"$RESOURCE_NAME\", \"roles\": [\"admin\"], \"action\": \"delete\"}" >> "$OUTPUT_FILE"
  
  echo "      ]" >> "$OUTPUT_FILE"
  echo "    }" >> "$OUTPUT_FILE"
  
  ORDER_COUNTER=$((ORDER_COUNTER + 40))
done

# Close JSON structure
echo "  ]" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

# Output completion message
echo "Privileges JSON successfully written to $OUTPUT_FILE."
