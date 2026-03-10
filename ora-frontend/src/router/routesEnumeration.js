// Utilities
import { useConnectionStore } from '@/stores/connectionStore';

//Components imports
import HomeView from '@/views/HomeView.vue'
import NotGranted from '@/components/NotGranted.vue';
import NotFound from '@/components/NotFound.vue'
import Logout from '@/views/LogoutView.vue';
import RolesAdministration from '@/views/rolesAdministration/RolesAdministration.vue';
import UsersAdministration from '@/views/usersAdministration/UsersAdministration.vue';
import ListRoles from '@/views/rolesAdministration/ListRoles.vue';
import FormationCreation from '@/views/parcoursFormation/FormationCreation.vue';
import Versions from '@/views/parcoursFormation/Versions.vue';
import ParcoursVersion from '@/views/parcoursFormation/ParcoursVersion.vue';
import ParcoursCompetences from '@/views/parcoursFormation/ParcoursCompetences.vue';
import ParcoursApprentissagesCritiques from '@/views/parcoursFormation/ParcoursApprentissagesCritiques.vue';
import ExportScreen from '@/views/ExportScreen.vue';
import ParcoursElementsConstitutifsNew from '@/views/parcoursFormation/ParcoursElementsConstitutifsNew.vue';
import ParcoursMaquette from '@/views/parcoursFormation/ParcoursMaquette.vue';
import ParcoursTableauDeBord from '@/views/parcoursFormation/ParcoursTableauDeBord.vue';
import GlobalParam from '@/views/Backoffice/views/GlobalParam.vue';
import Configuration from '@/views/Backoffice/views/Configuration.vue';
import Template from '@/views/Backoffice/views/Template.vue';
import ParametreView from '@/views/Backoffice/views/ParametreView.vue';
import RolesUtilisateurs from '@/views/Backoffice/views/RolesUtilisateurs.vue';
import Indicateurs from '@/views/Backoffice/views/Indicateurs.vue';
import MyProfile from '@/views/MyProfile.vue';

export const paths = {
    root: "/home",
    notGranted: "/403",
    login: "/login",
    logout: "/logout",
    export: "/export",
    authenticationReturn: '/authentication-return',
    userInfos: "/user-informations",
    parcoursFormation: "/parcours-formation",
    competence: "/competence",
    backoffice: "/backoffice",
    backoffice_etablisement: "/backoffice/etablissement",
    backoffice_composante: "/backoffice/composante",
    backoffice_parametre: "/backoffice/parametre",
    backoffice_tags: "/backoffice/tags",
    backoffice_type_diplomes: "/backoffice/type_diplomes",
    backoffice_conf_unite_td: "/backoffice/conf_cout_td",
    administrationRoles: "/administration",
    formation: '/formation',
    parcours: '/parcours',
    version: '/version',
    versionList: '/version-list/:idFormation',
    blocDeCompetences: '/maquette',
    composantesEssentielles: '/composantes-essentielles',
    ensemblesAC: '/ensembles-ac',
    apprentissagesCritiques: '/apprentissages-critiques',
    niveaux: '/niveaux',
    fichesRNCP: '/fiches-rncp',
    enseignements: '/enseignements',
    semestres: '/semestres',
    typesRessourcesPedagogiques: '/types-ressources-pedagogiques',
    diplomes: "/diplomes",
    gestionsDesComposantes: '/gestions-des-composantes',
    administration: '/administration',
    aPropos: "/a-propos",
    myProfile: "/mon-profil",
    contact: "/contact",
    planNavigation: "/plan-navigation",
    tableauPowerPointTMP: "/tableauTMP",
    tableauEasyLoading: "/tableauEasyLoading",
    protectedRouteTest: "/testProtectedRoute",
    affectationRoles: "/affectationRoles",
    listeRoles: "/listeRoles",
    parcoursVersion: "/version-parcours",
    competencesParcours: "/competences-parcours/:idVersion",
    apprentissagesCritiquesParcours: "/apprentissages-critiques-parcours",
    elementsConstitutifsParcours: "/elements-constitutifs-parcours",
    globalData: "/globalData",
    globalParams: "/globalParams",
    configuration: "/configuration",
    template: "/template",
    courriersInformations: "/courriels-informations",
    formulaire: "/formulaire",
    enquetes: "/enquetes",
    administrationDesTemplates: "/administration-des-templates",
    imports: "/imports",
    evenements: "/evenements",
    courriels: "/courriels",
    verifications: "/verifications",
    journauxEtLogs: "/journaux-et-logs",
    settings: "/settings",
    indicateurs: "/indicateurs",
    rolesEtUtilisateurs: "/roles-et-utilisateurs",
    dataviz: '/datavisualisation'
}

export const routes = [
    {
        path: '/',
        redirect: paths.root,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Redirection vers la page d\'accueil'
        }
    },
    {
        path: paths.notGranted,
        component: NotGranted,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Accès interdit'
        }
    },
    {
        name: 'Home',
        path: paths.root,
        component: HomeView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Accueil'
        }
    },
    {
        name: 'Connexion',
        path: paths.login,
        component: HomeView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Connexion'
        }
    },
    {
        name: "Déconnexion",
        path: paths.logout,
        component: Logout,
        meta: {
            isProtectedRoute: true,
            titlePage: 'Déconnexion'
        },
        beforeEnter: async (to, from, next) => {
            const connectionStore = useConnectionStore();
            await connectionStore.logout();

            next({ name: 'Home' });
        }
    },
    {
        name: 'Authentification retour',
        path: paths.authenticationReturn,
        component: null,
        meta: {
            titlePage: 'Complétion de l\'authentification'
        },
        beforeEnter: async (to, from, next) => {
            const connectionStore = useConnectionStore();
            await connectionStore.completeCookie();
            await connectionStore.login();
        }
    },
    {
        name: "Mon profil utilisateur",
        path: paths.myProfile,
        component: MyProfile,
        meta: {
            isProtectedRoute: true,
            titlePage: "Mon profil utilisateur"
        }   
    },
    {
            name: "Formation - Version 1",
        path: paths.parcoursVersion,
        component: ParcoursVersion,
        meta: {
            isProtectedRoute: false,
            titlePage: "Formation - Version 1"
        }
    },
    {
        name: "Parcours de formation",
        path: paths.parcoursFormation,
        component: FormationCreation,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Paramétrages à la formation'
        }
    },
    {
        name: "parcours-competences",
        path: paths.competencesParcours,
        component: ParcoursCompetences,
        meta: {
            ariane: {
                icon: "mdi-bullseye",
                code: 'competence',
                label: 'Compétences',
                param: 'idVersion',
                order: 2
            },
            isProtectedRoute: false,
            showAriane: true,
            titlePage: 'Compétences du parcours'
        }
    },
    {
        name: "elementsConstitutifsParcours",
        path: paths.elementsConstitutifsParcours,
        component: ParcoursElementsConstitutifsNew,
        meta: {
            ariane: {
                icon: "mdi-school-outline",
                code: 'elementsConstitutifs',
                label: 'Éléments constitutifs',
                order: 4
            },
            isProtectedRoute: false,
            showAriane: true,
            titlePage: 'Éléments constitutifs du parcours'
        }
    },
    {
        name: "apprentissagesCritiquesParcours",
        path: paths.apprentissagesCritiquesParcours,
        component: ParcoursApprentissagesCritiques,
        meta: {
            ariane: {
                icon: "mdi-book-open-variant-outline",
                code: 'apprentissageCritiques',
                label: 'Apprentissages',
                order: 3
            },
            isProtectedRoute: false,
            showAriane: true,
            titlePage: 'Apprentissages critiques du parcours'
        }
    },
    {
        name: "globalData",
        path: paths.globalData,
        component: ParcoursTableauDeBord,
        meta: {
            ariane: {
                icon: "mdi-sigma",
                code: 'donnees',
                label: 'Tableau de bord',
                order: 6
            },
            isProtectedRoute: false,
            showAriane: true,
            titlePage: 'Données globales du parcours'
        }
    },
    {
        name: "version-list",
        path: paths.versionList,
        component: Versions,

        meta: {
            ariane: {
                icon: "mdi-file-document-multiple-outline",
                code: 'versions',
                label: 'Versions',
                order: 1,
                param: 'idFormation'
            },
            showAriane: true,
            isProtectedRoute: false,
            titlePage: 'Liste des versions par parcours pour cette formation'
        }
    },
    {
        name: "export",
        path: paths.export,
        component: ExportScreen,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Exporter la formation'
        }
    },
    {
        name: 'blocDeCompetences',
        path: paths.blocDeCompetences,
        component: ParcoursMaquette,
        meta: {
            ariane: {
                icon: "mdi-chart-box-outline",
                code: 'maquette',
                label: 'Maquette',
                order: 5
            },
            isProtectedRoute: false,
            showAriane: true,
            titlePage: 'Blocs de connaissances et de compétences'
        }
    },
    {
        name: 'Formation',
        path: paths.formation,
        component: NotFound,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Formation Page'
        }
    },
    {
        name: 'Indicateurs',
        path: paths.dataviz,
        component: Indicateurs,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Indicateurs',
            isSettingsPage: true,
            settingsPageIcon: "mdi-chart-line",
        }
    },
    {
        name: "Rôles et utilisateurs",
        path: paths.rolesEtUtilisateurs,
        component: RolesUtilisateurs,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Rôles et utilisateurs',
            isSettingsPage: true,
            settingsPageIcon: "mdi-account-multiple-outline",
        }
    },
    {
        name: "Configuration",
        path: paths.configuration,
        component: Configuration,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Configuration',
            isSettingsPage: true,
            settingsPageIcon: "mdi-tune-vertical",
        }
    },
    {
        name: 'Paramètres',
        path: paths.settings,
        component: () => import('@/views/Backoffice/BackofficeSelection.vue'),
        meta: {
            isProtectedRoute: false,
            titlePage: 'Paramètres'
        },
    },

    {
        name: "Template",
        path: paths.template,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Template Page',
            isSettingsPage: true
        }
    },
    {
        name: "CourriersInformations",
        path: paths.courriersInformations,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Courriels Informations Page',
            settingsFather: paths.template,
        }
    },
    {
        name: "Formulaire",
        path: paths.formulaire,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Formulaire Page',
            settingsFather: paths.template,
        }
    },
    {
        name: "Enquetes",
        path: paths.enquetes,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Enquêtes Page',
            settingsFather: paths.template,
        }
    },
    {
        name: "AdministrationDesTemplates",
        path: paths.administrationDesTemplates,
        component: Template,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Administration des Templates Page',
            settingsFather: paths.template,
        }
    },
    {
        name: "Imports",
        path: paths.imports,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Imports Page',
            isSettingsPage: true
        }
    },
    {
        name: "Journaux et logs",
        path: paths.journauxEtLogs,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Journaux et logs',
            isSettingsPage: true
        }
    },
    {
        name: "Evenements",
        path: paths.evenements,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Événements Page',
            settingsFather: paths.journauxEtLogs,
        }
    },
    {
        name: "Courriels",
        path: paths.courriels,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Courriels Page',
            settingsFather: paths.journauxEtLogs,
        }
    },
    {
        name: "Verifications",
        path: paths.verifications,
        component: ParametreView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Vérifications Page',
            settingsFather: paths.journauxEtLogs,
        }
    },
    {
        name: "Rôles",
        path: paths.administrationRoles,
        component: RolesAdministration,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Rôles',
            settingsFather: paths.rolesEtUtilisateurs
        }
    },
    {
        name: "Utilisateurs",
        path: paths.affectationRoles,
        component: UsersAdministration,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Utilisateurs',
            settingsFather: paths.rolesEtUtilisateurs
        }
    },
    {
        name: "Liste des rôles",
        path: paths.listeRoles,
        component: ListRoles,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Liste des rôles Page',
            settingsFather: paths.rolesEtUtilisateurs
        }
    },
    {
        name: 'Paramètres globaux',
        path: paths.globalParams,
        component: GlobalParam,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Paramètres globaux',
            isSettingsPage: true,
        }
    },
    {
        name: "NotFound",
        path: '/:pathMatch(.*)*',
        component: NotFound,
        meta: {
            isProtectedRoute: false,
            titlePage: 'NotFound Page'
        }
    }
];
