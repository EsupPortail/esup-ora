import { paths } from '@/router/routesEnumeration';

export const navigationBackOffice = [
    {
        name: "Paramètres",
        icon: "mdi-cog-outline",
        path: paths.globalParams,
        grants: ['observateur', 'agent_scolarite', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique'],
        children: [
            {
                title: "Paramètres globaux",
                grants: ['observateur', 'agent_scolarite', 'administrateur_technique', 'administrateur_fonctionnel', 'ingenieur_pedagogique'],
            }
        ]
    },
    {
        name: "Configuration",
        icon: "mdi-tune-vertical",
        path: paths.configuration,
        grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
        children: [
            {
                title: 'Types de diplômes',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
            },
            {
                title: 'Tags',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

            },

            {
                title: 'Paramètres',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

            },
            {
                title: "Établissements",
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
            },
            {
                title: 'Composantes',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
            }
        ]
    },
    {
        name: "Template",
        icon: "mdi-file-document-edit-outline",
        grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

        path: paths.administrationDesTemplates,
        children: [
            {
                title: "Bulles d'informations",
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

            }
        ]
    },
    {
        name: "Rôles et utilisateurs",
        icon: "mdi-account-multiple-outline",
        grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel', 'agent_scolarite', 'ingenieur_pedagogique'],
        path: paths.rolesEtUtilisateurs,
        children: [
            {
                title: 'Gestion des utilisateurs',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

            },
            {
                title: 'Rattachement utilisateurs - composantes',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel', 'agent_scolarite', 'ingenieur_pedagogique'],

            },
            {
                title: 'Association utilisateurs - formations',
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel', 'agent_scolarite', 'ingenieur_pedagogique'],

            }
        ]
    },
    {
        name: "Imports",
        icon: "mdi-download",
        grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
        children: [
            {
                title: "Importation des composantes via fichier",
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
            }
        ]
    },
    {
        name: "Journaux et logs",
        icon: "mdi-volume-high",
        grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

        children: [
        ]
    },
    {
        name: "Indicateurs",
        icon: "mdi-chart-line",
        path: paths.dataviz,
        grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],
        children: [
            {
                title: "Vue d'ensemble",
                grants: ['observateur', 'administrateur_technique', 'administrateur_fonctionnel'],

            }
        ]
    }
];