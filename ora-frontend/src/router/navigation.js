import { paths } from '@/router/routesEnumeration';

export default {
  "Accueil": {
    icon: "mdi-home-outline",
    path: paths.root,
  },
  "Formation": {
    icon: "mdi-school-outline",
    path: paths.parcoursFormation,
  },
  "Administration": [
    {
      title: 'Administration',
      icon: "mdi-file-document-outline",
      path: paths.settings,
    },
    {
      title: "Paramètres",
      icon: "mdi-cog-outline",
      path: paths.globalParams
    },
    {
      title: "Configuration",
      icon: "mdi-tune-vertical",
      path: paths.configuration,
    },
    {
      title: "Template",
      icon: "mdi-file-document-edit-outline",
      path: paths.administrationDesTemplates,
    },
    {
      title: "Rôles et utilisateurs",
      icon: "mdi-account-multiple-outline",
      path: paths.administrationRoles,
    },
    {
      title: "Imports",
      icon: "mdi-download",
      path: '/notfound',
    },
    {
      title: "Journaux et logs",
      icon: "mdi-volume-high",
      path: '/notfound',
    },
    {
      title: "Indicateurs",
      icon: "mdi-chart-line",
      path: '/notfound',
    },
  ],
}
