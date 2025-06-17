# Notes de patchs

## 0.20.0 PRE-VERSION [RELEASE]

- WARNING: Refonte applicative validée par l'équipe. La v0 va être publiée.

- Prototypage export CSV/PDF. Mis en pause pour la refonte applicative 

## Mise à jour : 0.19.0

- Intégration de la web socket. Système permettant l'édition en simultanée des éléments d'Esup-ORA. Lorsqu'un utilisateur est présent sur une formation et qu'il modifie un élément, ajoute ou supprime; les autres utilisateurs voient en temps direct les modifications. Pages implémentées : Compétence, Apprentissage.

- Intégration de la prise en compte des groupes d'éléments constitutifs (Groupe EC) dans le calcul des données globales.

## Mise à jour : 0.18.1

- Intégration du module Shibboleth (Authentification Nationale Universitaire). Deux systèmes d'authentification sont désormais implémentées dans Esup-ORA : l'authentification locale et universitaire. 

## Mise à jour : 0.17.2

- Refonte du déploiement en mode SaaS et des modules d'Esup-ORA pour prévoir Shibboleth. Déplacement du module Shibboleth dans le backend pour gérer l'authentification de bout en bout côté backend.
Déclaration d'un nouveau module qui contient le backend + un apache + shibboleth.
L'application a désormais deux apaches (frontend + backend) pour répondre au besoin application concernant l'authentification.


## Mise à jour : 0.16.1

- Modification du module time-machine (en charge des dumps bdds). Désormais, les dumps se font sur la base de données Keycloak (en plus que le noyau bdd Esup-ORA)


## Mise à jour : 0.15.5

- Stabilisation de l'application. Corrections de nombreux bugs, refontes de certains modules pour corriger l'ensemble des features déployées. Préparation pour les environnements de tests et de démonstrations.

## Mise à jour : O.14.10

- Refonte du tableau "complexe" permettant d'associer des enseignements aux compétences (et de fait les apprentissages critiques)
- Correction du bug apprentissages critiques + compétence sélectionnée.
- Correction du Simple Data Table
- Stabilisation de la configuration globale de l'application pour paramétrer les formations (Back Office)
- Ajout de l'ordre d'affichage dans les niveaux
- Introduction des routes interceptor https pour autoriser la frontend.
## Mise à jour : 0.12.1
- Introduction au découpage frontend-backend pour le SaaS. Avant, le frontend était en frontal et dialoguaut avec le backend. 
Désormais, le backend prend les flux https des utilisateurs, proxy-pass vers le frontend si et seulement si l'utilisateur est connecté.
Autrement, il redirige (302 + 401) vers la page login de l'application.
Le module shibboleth est dans le service frontend actuellement.
À voir pour le déplacer dans le backend par la suite pour suivre ce raisonnement.
- Introduction de la mutualisation des ECs et BCCs dans une banque mutualisée et partagée entre les formations.
- Refonte de la création d'une formation
- Composant overlay (modale)
- Drag & Drop sur les éléments constitutifs, les groupes d'ECs dans un BCC.
- Introduction à la création de nombreux niveaux pour les apprentissages critiques.
 - Grande stabilisation de l'application. Corrections de nombreux bugs sur les features.
## Mise à jour : 0.11.0

- Formulaire de recherche (search engine) sur un composant. Utile notamment sur l'ajout d'utilisateurs.
- Effectifs théoriques, plusieurs paramètres à la formation.
- Introduction à la sémantique dans l'application.
- Page de données globales
- - Création du composant tableau complexe pour associer les enseignements à des apprentissages critiques/compétences dans des niveaux.
- Sticky headers sur tableau complexe
- Ajout d'une pop-up pour suivre les erreurs, succès, warnings dans l'application.
- Loaders pour suivre le chargement d'une action.
## Mise à jour : 0.10.0

- Intégration du module d'authentification locale.
- Keycloak est l'outil choisi. Lorsqu'un utilisateur se connectera avec Shibboleth, il verra son compte créé dans Keycloak (IAM) avec un one-time password-less mais l'impossibilité de se connecter depuis le compte local.
- Default role : Observateur
- Nombreuses fonctions, calls API vers Keycloak
- Partie administration des users dans Esup-ORA
- Module de token/refresh token en dialoguant avec Keycloak.
- Le refresh token se fait à l'expiration lors de calls API.
- Introduction d'un guardian / intercepteur http qui injecte directement le token à chaque call api.
