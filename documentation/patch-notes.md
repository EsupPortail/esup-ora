# Notes de patchs

## 1.15.=à compléter [DEBUG] [PREPARE FOR SaaS - Pré Release]
- Suppression de la fiche RNCP entraine la suppression des rncps associées au compétence (DROP Cascade)
- Fix bug sur la remontée des heures/crédits création formation
- Fix effectif théorique quand pas de parcours
- Les compétences RNCP sont désormais triées par code
- On peut supprimer une compétence (CASCADE sur niveaux et rncp)

## 1.13.6 (25/02/2026)
- Finalisation du module RNCP
    => le backend d'ORA fait un pont entre le front et le module RNCP distant
    => possibilité de link une rncp sur une formation, puis de sélectionner les bccs de la rncp
    => possibilité de unlink mais suppression des associations (non finalisé)
- Page mon profil utilisateur
- Fix bug filtrage formations en fonction des associations composantes/formations + owner + rôle
- Fix bug Shibboleth arrivée avec le bon rôle
- Remplacement titre agent de scolarité par gestionnaire de scolarité en display name
- Fix de l'accès au backoffice depuis certains rôles 
- Fix messages pas de compétences sur la page apprentissages critiques

## 1.12.9 (12/02/2026)
- Intégration des rôles : Observateur, Enseignant, Agent de Scolarité, Ingénieur Pédagogique, Administrateur Fonctionnel, Administrateur Technique
- Création d'une vue pour promouvoir ou rétrograder des utilisateurs
- Création d'une vue pour rattacher un utilisateur à une composante
- Création d'une vue pour rattacher un utilisateur à une formation (contributeurs)
- Page liste des formations (accueil) => filtrage des formations en fonction des droits (use case enseignant, agent de scolarité)
- Ajout de champs rattachement et owner à formation et composante pour linker les users keycloak aux objets d'esup ora
- On peut désormais ajouter plusieurs rôles à un utilisateur (UseCase VP => Observateur + Enseignant)
- Route pour supprimer des rôles.
- Patch rôle à injecter en bdd côté keycloak => ajout d'une hiérarchie entre les rôles
- Possibilité de switch entre les différents rôles de l'utilisateur
- ==> Debug le rôle agent de scolarite -> **besoin de l'injection du patch**


- Indicateurs : 
Ajout de la librairie graphiques vuetify à ESUP ORA pour préparer les indicateurs & tableaus de bord

- Formation listing & création 
=> ajout d'un moteur de recherche par libellé de la formation qui trie les formations par matching libellé
=> overflow Y sur la liste des formations
- Ajout d'une fonction pour supprimer les comptes ORA

Clear:
- Nettoyage de la pollution des logs backend

Fixes : 
- Bug 403 sur la sélection du rôle
- Déconnexion après inactivité

Montée de version de la stack applicative
- Mise à jour de toutes les dépendances du backend NodeJS
- Mise à jour de toutes les dépendances du frontend VueJS3
Debugging applicatif concernant cette montée de version. Ajustement de Prisma pour le passage en v7 (fix)


## 1.8.9 (19/11/2025)

- Ajout de l'export Excel de la formation finale dans les tableaux de bord.
- Mutualisation, filtrage par période de la formation sélectionnée en filtrage

## 1.8.5 (18/11/2025)

- Suppression coût équivalent TD
- Fix ordre des niveaux dans le tree view de elements constitutifs 
- Fix ouverture/fermeture des éléments dans le tree view EC quand un objet est modifié
- Fix de la remontée des enseignements dans options => uniquement ceux de la période

## 1.8.3 [RELEASE] (13/11/2025)

- Nettoyage modèle de données => suppression des éléments dépréciés + simplification de certains attributs
- Export PDF/Excel page maquette => remontée des enseignements par période.
- Début d'export final de la formation dans la page tableaux de bord

## 1.7.10 (05/11/2025)

- MaquetteTreeView => vue bcc => on ne remonte plus que les ecs qui sont liés à la compétence
- Mutualisation => filtrage par composante/formation + recherche textuelle
- Paramétrage => historisation des composantes
- Tableaux de bord => amélioration de la présentation des ACs

## 1.7.6 (03/11/2025)

- Les ECs sont désormais mutualisable
- Ajout d'une vue d'importation des éléments mutualisés .
- Nettoyage dans le code, sur des éléments inutilisés suite à la refonte graphique
- Remove des consoles.log qui viennent polluer la stack trace

## 1.7.3 (30/10/2025)

- Nettoyage applicatif sur les traces.

Paramètres : 
- Refonte des paramètres. => Partie administration recense tout les paramètres actuellement disponibles sous forme de cartes.
=> Configuration : ajout de l'affichage et de l'historisation des éléments. Pour diplômes et tags
Composantes : rangés par établissements. Sélectionnables dans le tableau (étab)

Ajout d'un retour visuel (en rouge) lors de la création d'une formation + pop up pour avertir qu'il y a une erreur
Modif sur l'effectif théorique globale de la formation => par parcours ou global

Bulle d'informations présentes sur chaque page du workflow. => paramétrable dans l'administration de l'appli

Importation automatique des enseignements. Système de lock si multi-clients
Finalisation du treeview en deux parties pour la maquette
Debug du refresh treeview sur les modifs

Parcours global => début d'ajout du calcul autour des compétences et des apprentissages critiques + pré-listing

De nombreux bugs ont été trouvés et corrigés dans cette nouvelle version. 
Rendant le workflow stable.

## 1.6.1 (01/10/2025)

- Corrections bugs mineurs page création formation:  
Remontée des composantes + formulaire formation => composantes triées par établissements
Les types de diplômes remontent en fonction de la composante sélectionné (et donc de son paramètre)
Remontée des utilisateurs en erreur
Trie formation par libellé ascendant

- Corrections workflow | Si valeur des étapes du workflow précédentes sont manquantes (compétences & apprentissages). => évite un crash de l'appli
- Gestion des erreurs et des valeurs manquantes création et modification formation (début workflow)  
- Modification pop up avec un timer pour voir quand elle disparait (> 5secondes)

- Ajout d'une bulle d'informations sur l'ensemble des pages du workflow (compétences, ac, ec, maquette ,tableaux de bord). Paramétrable dans le backoffice (partie templates)

## 1.5.3 (24/09/2025)
- Début et finalisation de la partie paramétrage des établissements, composantes, paramètres, types de diplomes et des tags.
- Export PDF sur certaines vues du workflow.
- Début des tableaux de bord
- Correctifs bugs mineurs
- Remonté du numéro de version côté application
- Réorganisation de la partie administration de l'appli

## 1.4.1 (09/09/2025)
- Début d'intégration de la vue parallèle à Semestre dans Maquette => BCC
- Branchement et correctifs autour de la websocket dans les vues AC,EC,Maquette
- Export Excel EC des enseignements pour toutes les périodes
- Drag&Drop Maquette fonctionnel dans Semestre.

## 1.3.2 (04/09/2025)
- Montée de version du core NodeJS
- Ajout des routes vers l'interface de configuration
- Compétence : duplication, édition OK. Via websocket.
- Apprentissages critiques => websocket : OK. 
- Éléments constitutitfs : TreeView finalisé (hors optimisation du chargement). Headers alignés avec le tree view. Validation des filtres via bouton post chargement tree view. 
- Maquette : Ajout d'un tree view en vue par semestre fonctionnel à 90%
- Maquette : Edition Card par type d'élément (enseignement, stage, portfolio, AMS)
- Maquette : Edition Card est fix en base. | Début vue parallèle par compétences
- Export Excel des pages compétences & apprentissages critiques via overlay et sélection des éléments à exporter

## 1.2.4 (23/07/2025)

- Changement mineur liste des formations thèmes + features
- Compétence : intégration d'un code couleur via une palette. On retrouvera ces couleurs sur le work flow
- Apprentissages critiques : carroussel de compétences, ajout d'une association parcours/ niveau
- Formation : instanciation des niveaux à la création avec le même titre de niveau pour chaque compétence. 
- Éléments constitutifs : Filtrage par périodes/compétences/niveaux + intégration d'une composant TreeView de Vuetify pour associer les enseignements aux ACs

## 1.1.0

Refonte applicative
- passage en thème blanc
- toolbar (menu du haut)
- burger menu (menu de gauche) avec une version icône et icône + titre
- fil d'ariane

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
