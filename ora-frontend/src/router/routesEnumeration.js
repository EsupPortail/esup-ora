// Utilities
import { getDataForTable } from '@/mocks/dataForTable.js';
import { useConnectionStore } from '@/stores/connectionStore';

//Components imports
import HomeView from '@/views/HomeView.vue'
import BackofficeView from '@/views/Backoffice/BackofficeView.vue'
import EtablissementView from '@/views/Backoffice/EtablissementView.vue'
import ComposanteView from '@/views/Backoffice/ComposanteView.vue'
import ParametreView from '@/views/Backoffice/ParametreView.vue'
import EditableDataTable from '@/components/EditableDataTable.vue'
import CustomTable from '@/components/CustomTable.vue'
import Competence from '@/views/CompetenceView.vue'
import NotFound from '@/components/NotFound.vue'
import Parcours from '@/views/competence/ParcoursView.vue'
import Version from '@/views/competence/VersionView.vue'
import View401 from '@/views/errorsViews/View401.vue';
import Login from '@/views/LoginView.vue';
import Logout from '@/views/LogoutView.vue';
import UserInformations from '@/views/UserInformations.vue';
import RecapitulatifBCC from '@/views/bcc/RecapitulatifBCC.vue';
import RolesAdministration from '@/views/rolesAdministration/RolesAdministration.vue';
import UsersAdministration from '@/views/usersAdministration/UsersAdministration.vue';
import ListRoles from '@/views/rolesAdministration/ListRoles.vue';
import FormationCreation from '@/views/parcoursFormation/FormationCreation.vue';
import Versions from '@/views/parcoursFormation/Versions.vue';
import ParcoursVersion from '@/views/parcoursFormation/ParcoursVersion.vue';
import ParcoursGlobalData from '@/views/parcoursFormation/ParcoursGlobalData.vue';
import ParcoursCompetences from '@/views/parcoursFormation/ParcoursCompetences.vue';
import ParcoursApprentissagesCritiques from '@/views/parcoursFormation/ParcoursApprentissagesCritiques.vue';
import ParcoursElementsConstitutifs from '@/views/parcoursFormation/ParcoursElementsConstitutifsNew.vue';
import path from 'path';
import TagView from '@/views/Backoffice/TagView.vue';
import TypeDiplomeView from '@/views/Backoffice/TypeDiplomeView.vue';
import ConfEquivalentTD from '@/views/Backoffice/ConfEquivalentTD.vue'
import ExportScreen from '@/views/ExportScreen.vue';
import BCC from '@/views/bcc/BCC.vue';
import ParcoursElementsConstitutifsNew from '@/views/parcoursFormation/ParcoursElementsConstitutifsNew.vue';
import ParcoursMaquette from '@/views/parcoursFormation/ParcoursMaquette.vue';
// Énumération des routes de l'app
export const paths = {
    root: "/home",
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
    blocDeCompetences: '/bloc-de-competences',
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
    globalData: "/globalData"
}


// Cet élément permet de linker une route à une vue
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
        name: "Informations utilisateur",
        path: paths.userInfos,
        component: UserInformations,
        meta: {
            isProtectedRoute: true,
            titlePage: 'Informations utilisateur'
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
        component: ParcoursGlobalData,
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
        name: "Administration des rôles",
        path: paths.administrationRoles,
        component: RolesAdministration,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Administration des rôles Page'
        }
    },
    {
        name: "Administration des utilisateurs",
        path: paths.affectationRoles,
        component: UsersAdministration,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Administration des utilisateurs Page'
        }
    },
    {
        name: "Liste des rôles",
        path: paths.listeRoles,
        component: ListRoles,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Liste des rôles Page'
        }
    },
    {
        name: 'Test Protected Route',
        path: paths.protectedRouteTest,
        component: View401,
        meta: {
            isProtectedRoute: true,
            titlePage: 'Test Protected Route Page'
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
        name: 'Compétence',
        path: paths.competence,
        component: Competence,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Compétence Page'
        },
        children: [
            {
                name: 'parcours',
                path: 'parcours',
                component: Parcours
            },
            {
                name: 'version',
                path: 'version',
                component: Version
            }
        ]
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
        name: 'Apprentissages critiques',
        path: paths.apprentissagesCritiques,
        component: ParcoursApprentissagesCritiques,
        props: { 
            tableData: getDataForTable('apprentissageCritiques')
        },
        meta: {
            isProtectedRoute: false,
            titlePage: 'Apprentissages critiques Page'
        }
    },
    {
        name: 'Niveaux',
        path: paths.niveaux,
        component: EditableDataTable,
        props: { 
            tableData: getDataForTable('niveaux')
        },
        meta: {
            isProtectedRoute: false,
            titlePage: 'Niveaux Page'
        }
    },
    // {
    //     name: 'Fiches RNCP',
    //     path: paths.fichesRNCP,
    //     component: BuildingPage
    // },
    // {
    //     name: 'Enseignements',
    //     path: paths.enseignements,
    //     component: BuildingPage
    // },
    // {
    //     name: 'Semestres',
    //     path: paths.semestres,
    //     component: BuildingPage
    // },
    // {
    //     name: 'Types ressources pédagogiques',
    //     path: paths.typesRessourcesPedagogiques,
    //     component: BuildingPage
    // },
    {
        name: 'Diplômes',
        path: paths.diplomes,
        component: EditableDataTable,
        props: { 
            tableData: getDataForTable('diplômes')
        },
        meta: {
            titlePage: 'Diplômes Page'
        }
    },
    // {
    //     name: 'Gestion des composantes',
    //     path: paths.gestionsDesComposantes,
    //     component: BuildingPage
    // },
    // {
    //     name: 'Administration',
    //     path: paths.administration,
    //     component: BuildingPage
    // },
    // {
    //     name: 'À propos',
    //     path: paths.aPropos,
    //     component: BuildingPage
    // },
    // {
    //     name: 'Contact',
    //     path: paths.contact,
    //     component: BuildingPage
    // },
    // {
    //     name: 'Plan de Navigation',
    //     path: paths.planNavigation,
    //     component: BuildingPage
    // },
    {
        name: "Tableau PowerPoint Temporaire",
        path: paths.tableauPowerPointTMP,
        component: CustomTable,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Tableau PowerPoint Temporaire Page'
        }    
    },
    {
        name: "Tableau Lazy Loading",
        path: paths.tableauEasyLoading,
        component: EditableDataTable,
        props: {
            tableData: getDataForTable('composantesEssentielles')
        },
        meta: {
            isProtectedRoute: false,
            titlePage: 'Tableau Lazy Loading Page'
        }
    },
    {
        name: "Backoffice",
        path: paths.backoffice,
        component: BackofficeView,
        meta: {
            isProtectedRoute: false,
            titlePage: 'Backoffice Page',
        },
        children: [
            {
                name: 'Etablissement',
                path: paths.backoffice_etablisement,
                component: EtablissementView,
                meta: {
                    isProtectedRoute: false,
                    titlePage: 'Etablissement Page'
                }
            },
            {
                name: 'Composante',
                path: paths.backoffice_composante,
                component: ComposanteView,
                meta: {
                    isProtectedRoute: false,
                    titlePage: 'Composante Page'
                }
            },
            {
                name: 'Paramètre',
                path: paths.backoffice_parametre,
                component: ParametreView,
                meta: {
                    isProtectedRoute: false,
                    titlePage: 'Paramètre Page'
                }
            },
            {
                name: 'Tags',
                path: paths.backoffice_tags,
                component: TagView,
                meta: {
                    isProtectedRoute: false,
                    titlePage: 'Tags Page'
                }
            },
            {
                name: 'Diplomes',
                path: paths.backoffice_type_diplomes,
                component: TypeDiplomeView,
                meta: {
                    isProtectedRoute: false,
                    titlePage: 'Diplomes Page'
                }
            },
            {
                name: 'Configuration coût équivalent TD',
                path: paths.backoffice_conf_unite_td,
                component: ConfEquivalentTD,
                meta: {
                    isProtectedRoute: false,
                    titlePage: 'Diplomes Page'
                }
            }
        ]
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
]
