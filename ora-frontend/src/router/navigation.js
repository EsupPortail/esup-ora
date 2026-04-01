import { paths } from '@/router/routesEnumeration';

export default {
  "Accueil": {
    icon: "mdi-home-outline",
    path: paths.root,
    grants: ['observateur', 'agent_scolarite', 'enseignant', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique', 'directeur_composante'],
  },
  "Formation": {
    icon: "mdi-school-outline",
    path: paths.parcoursFormation,
    grants: ['observateur', 'agent_scolarite', 'enseignant', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique', 'directeur_composante'],
  },
  "Administration": [
    {
      title: 'Administration',
      icon: "mdi-file-document-outline",
      path: paths.settings,
      grants: ['observateur', 'agent_scolarite', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique', 'directeur_composante'],
    },
    {
      title: "Paramètres",
      icon: "mdi-cog-outline",
      path: paths.globalParams,
      grants: ['observateur', 'agent_scolarite', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique', 'directeur_composante'],
    },
    {
      title: "Configuration",
      icon: "mdi-tune-vertical",
      path: paths.configuration,
      grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
    },
    {
      title: "Template",
      icon: "mdi-file-document-edit-outline",
      path: paths.administrationDesTemplates,
      grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
    },
    {
      title: "Rôles et utilisateurs",
      icon: "mdi-account-multiple-outline",
      path: paths.rolesEtUtilisateurs,
      grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique', 'agent_scolarite', 'directeur_composante'],
    },
    {
      title: "Imports",
      icon: "mdi-download",
      path: '/notfound',
      grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
    },
    {
      title: "Journaux et logs",
      icon: "mdi-volume-high",
      path: '/notfound',
      grants: ['observateur', 'administrateur_technique'],
    },
    {
      title: "Indicateurs",
      icon: "mdi-chart-line",
      path: paths.dataviz,
      grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel', 'directeur_composante'],
    },
  ],
  "Mon profil":
    {
      title: "Mon profil utilisateur",
      icon: "mdi-account-outline",
      path: paths.myProfile,
      grants: ['enseignant', 'observateur', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique', 'agent_scolarite', 'directeur_composante'],
    }
}
