# Documentation technique à l'usage des développeurs

## Stack Technique On-Premise
Esup-ORA est une application web composée des micro-services suivants :  

- VueJS3 - Frontend client (Framework JS)
- NodeJS - Backend Serveur  
- PostgreSQL - Base de données 
- Keycloak - Identity and Access Management (IAM - gestion des utilisateurs et des accès)

## Arborescence à la racine  

ora-frontend/(Application web ORA)  
├── application-data/(Volumes docker montés pour la base de données ainsi que keycloak. Volumes data)  
├── deployment-configuration/(Chaque microservice possède son répertoire et ses configurations)  
│   ├── backend/(répertoire conf Back nodejs)  
│   ├── ci-scripts/(scripts ci/cd utilitaires)   
│   ├── database/( scripts d'initialisation des droits et autres)    
│   ├── docker/(Dockerfiles pour la stack OnPremise et Distant SaaS)  
│   ├── frontend/(conf frontend)  
│   ├── keycloak/(Pré-conf RealmORA en local avec des paramètres pré-configurés)  
│   ├── npm-publisher/(Pré-conf RealmORA en local avec des paramètres pré-configurés)  
│   ├── proxy/(scripts bash pour les confs proxy si besoin)  
│   ├── service/(confs pour apache)  
│   ├── shibboleth/(confs shibboleth )  
│   ├── timemachine/(scripts vers le S3 et la bdd)  
├── documentation/(ensemble de documentations techniques et fonctionnelles)  
├── ora-backend/(le backend NodeJS)  
├── ora-frontend/(Application web VueJS)  
│   └── index.html  
├── .env_example (le fichier environment à décrire pour les microservices. à renommer en .env pour le déploiment OnPremise)  
├── .gitignore (Fichier de bypass fichiers git)    
├── .gitlab-ci.yml (CI/CD scripts)    
├── app.module.version (Versions des microservices et de l'application pour le déploiement et lancer les pipelines CI/CD)     
├── docker-compose.yaml (fichier décrivant le déploiement OnPremise)    
└── README.md (entrypoint de la documentation)    

## Informations primordiales utiles   

### Authentification, accès, rôles et privilèges  
Cette partie est géré côté frontend via des middlewares (injection de payload authentification, notamment le token, le rôle), des règles dans l'entrypoint (App.vue).  
Il faut savoir que pendant la phase de développement, nous ne voulions pas implémenter l'ensemble du moteur de privilèges unicaen.  
C'est pourquoi, une implémentation simplifiée a été intégrée à ORA.  
L'idée est de faire un filtrage en fonction des rôles sur les vues qui appelent les données.  
Par exemple, la liste des formations. On filtre qui peut voir quoi en fonction du rôle.  

Enfin, des middlewares et des vérifications sont effectuées coté backend pour sécuriser les calls APIs.  

### Exposition de l'application  

Lorsque le client se connecte depuis son navigateur à l'application, il est automatiquement redirigé vers le backend en mode proxy.  
Si le backend reçoit une requête avec un début de path en /api alors il le gère.  
Sinon, pour tout autre route, il le proxy pass vers l'application web (le frontend).  
Cette façon de faire était nécessaire pour l'implémentation de Shibboleth en SaaS mais aussi pour des règles de sécurité.  

## Descriptif des micro-services
###  Frontend Vue 3  

1. Overview  

L'application Web (frontend) est développé avec le framework VueJS 3.  
De nombreux packages sont utilisés avec notamment le framework UI Vuetify.  
Voici une liste non exhaustive de packages importants utilisés dans cette application :  

    - fortawesome : icones + fonts pour vuetify 
    - apexchats : graphiques dans l'appli   
    - axios : librairie requête http
    - exceljs : création de fichiers excel
    - pdfmake : création de fichiers pdf
    - pinia : store local in-app  

2. Arborescence du frontend  

ora-frontend/  
├── src/  
│   ├── assets/(images statiques)  
│   ├── components/(composants globales)  
│   ├── environment/(configuration statique de l'app - vars envs & routes statiques du bacj)  
│   ├── helpers/(depreciated)  
│   ├── layout/(menus + composants squelettes)  
│   │   ├── DrawerMenuLayout.vue(Menu partie gauche)  
│   │   ├── DrawerMenuLayoutElements.vue(éléments menus)  
│   │   ├── FooterLayout.vue(depreciated)  
│   │   └── ToolbarLayout.vue(menu top)  
│   ├── plugins/(fonctions pour le backend et le store globale in-app)  
│   ├── router/    
│   │   ├── navigation.js(routes du drawer, icons et liste des rôles autorisés)    
│   │   ├── navigationBackOffice.js(routes du backoffice avec les cards)     
│   │   ├── router.js (fonctions noyaux du routeur - middlewares de redirection)      
│   │   └── routesEnumeration.js(ensemble des routes du front, + linkage vers les composants vue)   
│   ├── services/(api- peut être déprécié?)   
│   ├── stores/(ensemble de connexions vers le backoffice avec des stockages en local après  (call) + Méthodes CRUD    
│   ├── views/(composants uniques)  
│   │   ├── Backoffice/  
│   │   ├── competence/(depreciated)  
│   │   ├── parcoursFormation/(workflow principal - toute la partie création formation)    
│   │   ├── Backoffice/  
│   │   │   ├── Home.vue  
│   │   │   └── About.vue  
│   │   │   ├── Home.vue  
│   │   │   └── About.vue  
│   │   └── le reste étant déprécié
│   └── Quelques composants uniques à prendre en compte
├── public/  
│   └── index.html  
│   
└── App.vue( Entypoint appelant le router et les composants squelettes + des middlewares d'authent et de redirection et de payload pour envoyer le token etc. Composant central au front)   

###  Backend NodeJS  

1. Structure des dossiers  

ora-backend/  
├── src/  
│   ├── configs/(Routes whitelisté côté front, back, acces via script distant mais aussi logger )  
│   ├── console/(Invite de commandes en console sur des usages particuliers. Ex: changer role utilisateur)  
│   ├── controllers/(Point d'entrée d'une route. Logique métier qui fait jointure entre la route et le service)  
│   ├── middlewares/(Système pré-main-request. Ex: auth, privilège, whitelist, etc.)  
│   ├── models/( Définition du modèle prisma et du générateur associé. Emplacement des migrations)    
│   ├── routes/( Énumération de l'ensemble des routes applicatives.)  
│   ├── services/( Classes métier pour intéragir avec les outils et services tiers (Keycloak, Prisma, Socket, etc.))  
│   │   
│   ├── app.ts (Noyau du backend, instancie les middlewares, se met en mode API, etc)   
│   ├── pre-start.ts (Préchargement de module. Ex: dotenv)   
│   └── server.ts (Chargement des certificats suivant le mode choisi + en écoute sur un port en fonction de la conf, etc.)  
└── App.vue( Entypoint appelant le router et les composants squelettes + des middlewares d'authent et de redirection et de payload pour envoyer le token etc. Composant central au front)   

### Keycloak IAM

#### Usage  
Keycloak a un rôle de gestion d'utilisateurs dans notre application. On aurait pu intégrer shibboleth mais on ne se sert que des comptes locaux.  
L'avantage étant la génération de token, refresh, des routes spécifiques.  
Ainsi que des rôles ORA qui sont préalablement créé dans le RealmORA Keycloak.  
Un client id/secret est disponible pour notre backend.  
Il est le seul, en mesure d'intéragir directement via ce système vers Keycloak
Concernant l'authentification par shibboleth, un compte local, en one-time-password, est généré pour un compte universitaire.  

### PostgreSQL - Database

Notre application se base sur l'ORM Prisma.  
Génération dans le conteneur ora-backend :  
npx prisma schema generate  
npx prisma migrate deploy (ou dev si + )  


