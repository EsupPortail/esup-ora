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


-----------------
Déploiement d'une migration prisma.

Modifier le script de migration pour faire des transitions

appliquer les transitions directement en bdd


mettre en applied les migrations en prod si tout est ok 



npx prisma migrate resolve --applied 20250710124548_add_notion_of_niveau_parcours


npx prisma migrate status

npx prisma migrate deploy