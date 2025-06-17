## Changement du schéma de base de données


Dans le cas où on veut éditer une table, ou en rajouter une.  

Il faut éditer le fichier 

```
ora-backend/prisma/schema.prisma
```

Puis appliquer une migration à notre SGBD avec la comande suivante :  

```
npx prisma migrate dev --name [NAME_MIGRATION] --schema src/models/schema.prisma
```

Puis une synchro :  

```
npx prisma db push --schema src/models/schema.prisma 
```