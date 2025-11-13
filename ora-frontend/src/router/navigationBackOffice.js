import { paths } from '@/router/routesEnumeration';

export const navigationBackOffice = [
    {
        name: "Paramètres",
        icon: "mdi-cog-outline",
        path: paths.globalParams,
        children: [
            {
                title: "Paramètres globaux",
            }
        ]
    },
    {
        name: "Configuration",
        icon: "mdi-tune-vertical",
        path: paths.configuration,
        children: [
            {
                title: 'Types de diplômes',
            },
            {
                title: 'Tags',
            },

            {
                title: 'Paramètres',
            },
            {
                title: "Établissements",
            },
            {
                title: 'Composantes',
            }        
        ]
    },
    {
        name: "Template",
        icon: "mdi-file-document-edit-outline",
        path: paths.administrationDesTemplates,
        children: [
            {
                title: "Bulles d'informations"
            }
        ]
    },
    {
        name: "Rôles et utilisateurs",
        icon: "mdi-account-multiple-outline",
        children: [
        ]
    },
    {
        name: "Imports",
        icon: "mdi-download",
        children: [
        ]
    },
    {
        name: "Journaux et logs",
        icon: "mdi-volume-high",
        children: [
        ]
    },
    {
        name: "Indicateurs",
        icon: "mdi-chart-line",
        children: [
        ]
    }
];