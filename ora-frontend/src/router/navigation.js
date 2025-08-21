import { paths } from '@/router/routesEnumeration';

export default {
  "Accueil": {
    icon: "mdi-home-outline",
    path: paths.root,
  },
  "Formation": {
    icon: "mdi-file-document-outline",
    path: paths.parcoursFormation,
  },
  "Administration": [
    {
      title: "Paramètres",
      icon: "mdi-cog-outline",
      path: paths.backoffice_etablisement,
    },
    {
      title: "Configuration",
      icon: "mdi-tune-vertical",
      path: paths.administrationRoles,
    },
    {
      title: "Rôles et utilisateurs",
      icon: "mdi-account-multiple-outline",
      path: paths.administrationRoles,
    },
  ],
}
