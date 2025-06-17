# Installation et déploiement

Application déployée localement avec NodeJS pour le backend et VueJS3 pour le front.  

<b>Stack technique :</b> 
- NodeJS Backend API
- Keycloak comme IAM (Identity & Access Management )
- Vuejs3 couplé à vuetify pour le frontend
- Postgresql Base de données relationnelle couplé avec Prisma côté backend & front

## Configuration

Renseigner les différentes variables d'environnement voulues dans le fichier /.env en dupliquant le fichier /.env_example et en remplissant les valeurs.  


## Démarrage des services de l'application localement

Démarrer les services d'ORA :  

```
docker compose -f ./docker-compose.yaml up --build --force-recreate
```

Attendre l'instanciation des services.  


## Génération de la base de données de démonstration

```
docker exec -it ora-backend bash
npm run p-m
```


Une fois effectuée, rendez-vous sur :  

- Keycloak Identity Access Manager : http://localhost:8080
- Backend API ORA : http://localhost:1111
- Frontend ORA : http://localhost:5173
- Database pour IAM & Application : http://localhost:5432
- SWAGGER API Documentation : http://localhost:1111/swagger-documentation/