import {paths} from '@/router/routesEnumeration';

export default {
    "Accueil": paths.root,
    "Parcours formation": paths.parcoursFormation,
    "Administration": {
        "Configuration": paths.backoffice_etablisement,
        "Utilisateurs": paths.administrationRoles,
    },
    // "ProtectedRoute": paths.protectedRouteTest,
};

