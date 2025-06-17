## Exporter un royaume Keycloak

Login container
```
touch /tmp/export-realm.json
/opt/keycloak/bin/kc.sh export --file /tmp/export-realm.json
```
On retrouve les fichiers liés au Royaume.