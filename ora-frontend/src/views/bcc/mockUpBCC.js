export const dataTestBCC = {
    "bccs": [
        {
            id: 1,
            title: "Implémentation d'un besoin Client",
            isTroncCommun: true,
            isSpecialization: false, // Opposé à tronc commun
            apprentissagesCritiques: [
                {
                    id: 1,
                    title: "Analyser un besoin client",
                    isCritical: true
                },
                {
                    id: 2,
                    title: "Proposer une solution",
                    isCritical: true
                },
                {
                    id: 3,
                    title: "Réaliser une solution",
                    isCritical: true
                }
            ],
            competence: "Réaliser une solution",
            description: "Ce bloc de compétences permet de valider la capacité à analyser un besoin client, proposer une solution et réaliser cette solution.",
            credit: 3,
            elementsConstitutifs: [
                {
                    enseignement: {
                        id: 1,
                        title: "Initiation au développement web",
                        volumehoraire: {
                            tp: 3,
                            td: 3,
                            cm: 4
                        },
                        isPresentiel: true,
                        isDistanciel: false,
                        isRequired: true,
                        isOption: false,
                        description: "Ce cours permet d'acquérir les bases du développement web. Il est nécessaire pour la réalisation de l'application web.",
                        tags: [
                            "web", "développement", "front-end"
                        ]
                    }
                },
                {
                    enseignement: {
                        id: 2,
                        title: "Programmation avancée",
                        volumehoraire: {
                            tp: 2,
                            td: 2,
                            cm: 3
                        },
                        isPresentiel: true,
                        isDistanciel: false,
                        isRequired: true,
                        isOption: false,
                        description: "Ce cours approfondit les concepts de programmation et introduit des sujets avancés tels que les structures de données avancées, les algorithmes de tri, la programmation orientée objet, etc.",
                        tags: [
                            "programmation", "avancée", "algorithmes"
                        ]
                    } 
                },
                {
                    enseignement: {
                        id: 4,
                        title: "Communication professionnelle",
                        volumehoraire: {
                            tp: 1,
                            td: 2,
                            cm: 2
                        },
                        isPresentiel: true,
                        isDistanciel: false,
                        isRequired: true,
                        isOption: false,
                        description: "Ce cours développe les compétences en communication professionnelle, y compris la rédaction de rapports, la présentation orale et la communication interpersonnelle.",
                        tags: [
                            "communication", "professionnelle", "rédaction"
                        ]
                    } 
                },
                {
                    sae: {
                        title: "Annuaire",
                        id: 5,
                        description: "Une organisation a besoin d'un annuaire numérique. Cette application doit reprendre toutes les données clients possédées par l'organisation. Elle devra permettre la saisie, la modification et la consultation de ces données, de manière structurée et lisible.",
                        accompagnement: {
                            tp: 3,
                            td: 3,
                            pt: 4,
                        },
                        travailPersonnel: 10,
                        elementsConsitutifs: [

                        ],
                        famillesDeSituation: [

                        ],
                        criteresDexigences: [

                        ],
                        nbEtudiantMin: 5,
                        nbEtudiantMax: 10,
                        tags: [
                            "saé", "informatique", "développement"
                        ]
                    },
                }
            ]
        },
        {
            id: 2,
            title: "Optimisation des performances d'une application",
            isTroncCommun: false,
            isSpecialization: true,
            apprentissagesCritiques: [
                {
                    id: 4,
                    title: "Analyser les performances d'une application",
                    isCritical: true
                },
                {
                    id: 5,
                    title: "Identifier les goulots d'étranglement",
                    isCritical: true
                },
                {
                    id: 6,
                    title: "Optimiser le code",
                    isCritical: true
                }
            ],
            competence: "Optimiser le code",
            description: "Ce bloc de compétences permet de valider la capacité à analyser les performances d'une application, identifier les goulots d'étranglement et optimiser le code pour améliorer les performances.",
            credit: 3,
            elementsConstitutifs: [
                {
                    enseignement: {
                        id: 3,
                        title: "Architecture logicielle",
                        volumehoraire: {
                            tp: 2,
                            td: 2,
                            cm: 3
                        },
                        isPresentiel: true,
                        isDistanciel: false,
                        isRequired: true,
                        isOption: false,
                        description: "Ce cours aborde les principes de base de l'architecture logicielle et les différentes architectures couramment utilisées dans le développement d'applications.",
                        tags: [
                            "architecture", "logicielle", "conception"
                        ]
                    }
                },
                {
                    enseignement: {
                        id: 5,
                        title: "Tests et validation",
                        volumehoraire: {
                            tp: 2,
                            td: 2,
                            cm: 3
                        },
                        isPresentiel: true,
                        isDistanciel: false,
                        isRequired: true,
                        isOption: false,
                        description: "Ce cours présente les techniques de tests et de validation utilisées dans le développement logiciel pour assurer la qualité et la fiabilité des applications.",
                        tags: [
                            "tests", "validation", "qualité"
                        ]
                    } 
                },
                {
                    enseignement: {
                        id: 6,
                        title: "Déploiement et gestion des applications",
                        volumehoraire: {
                            tp: 1,
                            td: 2,
                            cm: 2
                        },
                        isPresentiel: true,
                        isDistanciel: false,
                        isRequired: true,
                        isOption: false,
                        description: "Ce cours aborde les différentes étapes du déploiement et de la gestion des applications, y compris la configuration des serveurs, la gestion des bases de données et la surveillance des performances.",
                        tags: [
                            "déploiement", "gestion", "serveurs"
                        ]
                    } 
                },
                {
                    portfolio: {
                        title: "Portfolio",
                        id: 7
                    },
                },
                {
                    sae: {
                        title: "Application de gestion des stocks",
                        id: 8,
                        description: "Une entreprise souhaite développer une application de gestion des stocks pour suivre et contrôler les mouvements de stock, les niveaux de stock et les commandes. L'application doit être capable de gérer plusieurs entrepôts et de générer des rapports sur les stocks.",
                        accompagnement: {
                            tp: 3,
                            td: 3,
                            pt: 4,
                        },
                        travailPersonnel: 10,
                        elementsConsitutifs: [
        
                        ],
                        famillesDeSituation: [
        
                        ],
                        criteresDexigences: [
        
                        ],
                        nbEtudiantMin: 5,
                        nbEtudiantMax: 10,
                        tags: [
                            "saé", "gestion", "stocks"
                        ]
                    },
                }
            ]
        }        
    ]
}