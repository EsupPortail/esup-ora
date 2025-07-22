import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  console.log("🔄 Reset des données...");

  // Récupérer les noms des tables via Prisma
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  await prisma.$transaction(
    tables.map(({ tablename }) =>
      prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`)
    )
  );

  console.log("✅ Toutes les données ont été supprimées !");
  console.log('Injection du seed...')

  const typeDIplomeLicence = await prisma.type_diplome.create({
    data: {
      libelle: "Licence",
      heures: 680,
      credits: 180,
    },
  });
  const typeDIplomeMaster = await prisma.type_diplome.create({
    data: {
      libelle: "Master",
      heures: 240,
      credits: 120,
    },
  });
  const defaultParametre = await prisma.parametre.create({
    data: {
      libelle: "Paramètre UNICAEN TEST sémantique",
      description: "Ceci est un paramètre de test injecté depuis le seed",
      duree_formation: 6,
      duree_formation_unite: "semestre",
      semantique_competence: "Compétence",
      semantique_apprentissage: "Apprentissages",
      semantique_famille: "Famille Situation",
      semantique_critere: "Critère",
      semantique_bcc: "BCC",
      semantique_ue: "UE",
      semantique_ec: "EC",
      type_diplomes: {
        connect: [{ id: typeDIplomeLicence.id }, { id: typeDIplomeMaster.id }],
      },
    },
  });

  const defaultEtablissement = await prisma.etablissement.create({
    data: {
      code: "UNICAEN",
      libelle: "Étab Université de Caen, Normandie",
      parametre: {
        connect: { id: defaultParametre.id },
      },
    },
  });

  // Composantes
  const defaultComposanteScience = await prisma.composante.create({
    data: {
      libelle: "Comp UFR des Sciences",
      code: "UFRS",
      etablissement: {
        connect: { id: defaultEtablissement.id },
      },
      parametre: {
        connect: { id: defaultParametre.id },
      },
    },
  });

  const typeFormationInformatique = await prisma.type_formation.create({
    data: {
      libelle: "Informatique",
    },
  });

  // Diplomes
  const defaultDiplomeLicence = await prisma.diplome.create({
    data: {
      libelle: "Licence",
    },
  });
  const defaultDiplomeMasterInformatique = await prisma.diplome.create({
    data: {
      libelle: "Master",
    },
  });
  const defaultDiplomeDU = await prisma.diplome.create({
    data: {
      libelle: "DU",
    },
  });
  const defaultDiplomeBUT = await prisma.diplome.create({
    data: {
      libelle: "BUT",
    },
  });
  const defaultDiplomeIngenieur = await prisma.diplome.create({
    data: {
      libelle: "Ingénieur",
    },
  });

  // Formations
  const formationIA = await prisma.formation.create({
    data: {
      libelle: "Master Informatique Science des données",
      duree: 2,
      duree_unite: "Années",
      nb_credits: 180,
      nb_heures_enseignement: 2000,
      nombre_de_niveaux: 3,
      composante: {
        connect: { id: defaultComposanteScience.id },
      },
      diplome: {
        connect: { id: defaultDiplomeMasterInformatique.id },
      },
    },
  });

  const parcoursIA = await prisma.parcours.create({
    data: {
      libelle: "Intelligence artificielle",
      description:
        "Le parcours Intelligence Artificielle (IA) est un parcours de Master 2 de l’Université de Caen Normandie. Il est ouvert aux étudiants titulaires d’un Master 1 en informatique ou équivalent. Ce parcours est une formation de haut niveau en IA, qui permet aux étudiants de se spécialiser dans ce domaine en pleine expansion. Les étudiants suivent des enseignements théoriques et pratiques en IA, en apprentissage automatique, en traitement automatique du langage naturel, en vision par ordinateur, en robotique, etc. Les étudiants réalisent également un projet de recherche en IA, encadré par un enseignant-chercheur du GREYC, laboratoire de recherche en informatique de l’Université de Caen Normandie.",
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });

  const parcoursCybersecu = await prisma.parcours.create({
    data: {
      libelle: "Cybersécurité",
      description:
        "Le parcours Cybersécurité est un parcours de Master 2 de l’Université de Caen Normandie. Il est ouvert aux étudiants titulaires d’un Master 1 en informatique ou équivalent. Ce parcours est une formation de haut niveau en cybersécurité, qui permet aux étudiants de se spécialiser dans ce domaine en pleine expansion. Les étudiants suivent des enseignements théoriques et pratiques en cybersécurité, en cryptographie, en sécurité des systèmes d’information, en sécurité des réseaux, en sécurité des applications, etc. Les étudiants réalisent également un projet de recherche en cybersécurité, encadré par un enseignant-chercheur du GREYC, laboratoire de recherche en informatique de l’Université de Caen Normandie.",
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });

  const parcoursTechnoWeb = await prisma.parcours.create({
    data: {
      libelle: "Technologies du Web",
      description:
        "Le parcours Technologies du Web est un parcours de Master 2 de l’Université de Caen Normandie. Il est ouvert aux étudiants titulaires d’un Master 1 en informatique ou équivalent. Ce parcours est une formation de haut niveau en cybersécurité, qui permet aux étudiants de se spécialiser dans ce domaine en pleine expansion. Les étudiants suivent des enseignements théoriques et pratiques en cybersécurité, en cryptographie, en sécurité des systèmes d’information, en sécurité des réseaux, en sécurité des applications, etc. Les étudiants réalisent également un projet de recherche en cybersécurité, encadré par un enseignant-chercheur du GREYC, laboratoire de recherche en informatique de l’Université de Caen Normandie.",
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });

  const version10 = await prisma.version.create({
    data: {
      libelle: "1.0",
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });

  const periode1 = await prisma.periodes.create({
    data: {
      libelle: "Semestre 1",
      version: {
        connect: { id: version10.id },
      },
    },
  });
  const periode2 = await prisma.periodes.create({
    data: {
      libelle: "Semestre 2",
      version: {
        connect: { id: version10.id },
      },
    },
  });
  const periode3 = await prisma.periodes.create({
    data: {
      libelle: "Semestre 3",
      version: {
        connect: { id: version10.id },
      },
    },
  });
  const periode4 = await prisma.periodes.create({
    data: {
      libelle: "Semestre 4",
      version: {
        connect: { id: version10.id },
      },
    },
  });

  const competenceDevAppli = await prisma.competence.create({
    data: {
      libelle: "Réaliser un développement d'application",
      color_hexadecimal: '#B2C453',
      version: {
        connect: { id: version10.id },
      },
    },
  });

  const c1ce1 = await prisma.contexte_evaluation.create({
    data: {
      libelle: "Élaborer une application informatique",
      ordre: 1,
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });
  const c1ce2 = await prisma.contexte_evaluation.create({
    data: {
      libelle: "Faire évoluer une application",
      ordre: 2,
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });
  const c1ce3 = await prisma.contexte_evaluation.create({
    data: {
      libelle:
        "Maintenir en conditions opérationnelles une application informatique",
      ordre: 3,
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });

  const critereExigence1 = await prisma.critere_exigence.create({
    data: {
      libelle: "En respectant les besoins décrits par le client",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });

  const critereExigence2 = await prisma.critere_exigence.create({
    data: {
      libelle: "En appliquant les principes algorithmiques",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });

  const critereExigence3 = await prisma.critere_exigence.create({
    data: {
      libelle: "En veillant à la qualité du code et à sa documentation",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });

  const critereExigence4 = await prisma.critere_exigence.create({
    data: {
      libelle: "En choisissant les ressources techniques appropriées",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });

  // CARACTERE EVALUABLE TYPE
  const caracEvaluables = await prisma.caractere_evaluable_type.createMany({
    data: [
      {
        libelle: "Manière de communiquer",
      },
      {
        libelle:
          "Maitrise des ressources internes (gestes, savoirs, savoir-faire) ou externes",
      },
      {
        libelle:
          "Maitrise des règles ou des contraintes (déontologie, besoins, aléas, imprévus)",
      },
      {
        libelle: "Méthodologie",
      },
      {
        libelle: "Qualité du résultat",
      },
    ],
  });

  const competenceOptiAppli = await prisma.competence.create({
    data: {
      libelle: "Optimiser des applications informatiques",
      color_hexadecimal: '#287A8F',
      version: {
        connect: { id: version10.id },
      },
    },
  });
  const c2ce1 = await prisma.contexte_evaluation.create({
    data: {
      libelle:
        "Améliorer les performances des programmes dans des contextes contraints",
      ordre: 1,
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });
  const c2ce2 = await prisma.contexte_evaluation.create({
    data: {
      libelle:
        "Limiter l'impact environnemental d'une application informatique",
      ordre: 2,
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });
  const c2ce3 = await prisma.contexte_evaluation.create({
    data: {
      libelle:
        "Mettre en place des applicaitons informatiques adaptées et innovantes",
      ordre: 3,
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });
  const critereC2Exigence1 = await prisma.critere_exigence.create({
    data: {
      libelle: "En formalisant et modélisant des situations complexes",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });

  const critereC2Exigence2 = await prisma.critere_exigence.create({
    data: {
      libelle:
        "En recensant les algorithmes et les structures de données usuels",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });

  const critereC2Exigence3 = await prisma.critere_exigence.create({
    data: {
      libelle: "En s'appuyant sur des schémas de raisonnement",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });

  const critereC2Exigence4 = await prisma.critere_exigence.create({
    data: {
      libelle: "En justifiant les choix et validant les résultats",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });

  const competenceAdministrerSystemes = await prisma.competence.create({
    data: {
      libelle: "Administrer des systèmes informatiques communicants",
      color_hexadecimal: '#A5A0A0',
      version: {
        connect: { id: version10.id },
      },
    },
  });
  const critereC3Exigence1 = await prisma.critere_exigence.create({
    data: {
      libelle: "En sécurisant le système d'information",
      competence: {
        connect: { id: competenceAdministrerSystemes.id },
      },
    },
  });

  const critereC3Exigence2 = await prisma.critere_exigence.create({
    data: {
      libelle:
        "En appliquant les normes en vigueur et les bonnes pratiques architecturales et de sécurité",
      competence: {
        connect: { id: competenceAdministrerSystemes.id },
      },
    },
  });

  const critereC3Exigence3 = await prisma.critere_exigence.create({
    data: {
      libelle: "En offrant une qualité de service optimale",
      competence: {
        connect: { id: competenceAdministrerSystemes.id },
      },
    },
  });

  const critereC3Exigence4 = await prisma.critere_exigence.create({
    data: {
      libelle: "En assurant la continuité d'activité",
      competence: {
        connect: { id: competenceAdministrerSystemes.id },
      },
    },
  });

  const c1niveau1 = await prisma.niveau.create({
    data: {
      libelle: "Débutant",
      description: "Développer des applications informatiques simples",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });

  const n1ac1 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Implémenter des conceptions simples",
      ordre: 1,
      niveau: {
        connect: { id: c1niveau1.id },
      },
    },
  });
  const n1ac2 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Élaborer des conceptions simples",
      ordre: 2,
      niveau: {
        connect: { id: c1niveau1.id },
      },
    },
  });
  const n1ac3 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Faire des essais et évaluer leurs résultats en regard de spécifications",
      ordre: 3,
      niveau: {
        connect: { id: c1niveau1.id },
      },
    },
  });
  const n1ac4 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Développer des interfaces utilisateurs",
      ordre: 4,
      niveau: {
        connect: { id: c1niveau1.id },
      },
    },
  });

  const c1niveau2 = await prisma.niveau.create({
    data: {
      libelle: "Intermédiaire",
      description: "Partir des exigences et aller jusqu'à l'application",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });
  const n2ac1 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Adopter de bonnes pratiques de conception et de programmation",
      ordre: 1,
      niveau: {
        connect: { id: c1niveau2.id },
      },
    },
  });
  const n2ac2 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Elaborer et implémenter les spécifications fonctionneles à partir des exigences",
      ordre: 2,
      niveau: {
        connect: { id: c1niveau2.id },
      },
    },
  });
  const n2ac3 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Vérifier et valider la qualité de l'application par les tests",
      ordre: 3,
      niveau: {
        connect: { id: c1niveau2.id },
      },
    },
  });
  const n2ac4 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Appliquer les principes d'accessibilité et d'ergonomie",
      ordre: 4,
      niveau: {
        connect: { id: c1niveau2.id },
      },
    },
  });
  const c1niveau3 = await prisma.niveau.create({
    data: {
      libelle: "Compétent",
      description: "Adapter des applications sur un ensemble de supports",
      competence: {
        connect: { id: competenceDevAppli.id },
      },
    },
  });
  const n3ac1 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Choisir et implémenter les architectures adaptées",
      ordre: 1,
      niveau: {
        connect: { id: c1niveau3.id },
      },
    },
  });
  const n3ac2 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Faire évoluer une application existante",
      ordre: 2,
      niveau: {
        connect: { id: c1niveau3.id },
      },
    },
  });
  const n3ac3 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Intégrer des solutions dans un environnement de production",
      ordre: 4,
      niveau: {
        connect: { id: c1niveau3.id },
      },
    },
  });

  const c2niveau1 = await prisma.niveau.create({
    data: {
      libelle: "Débutant",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });
  const c2n1ac1 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Analyser un problème avec méthode",
      ordre: 1,
      niveau: {
        connect: { id: c2niveau1.id },
      },
    },
  });
  const c2n1ac2 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Comparer des algorithmes pour des problèmes classiques",
      ordre: 2,
      niveau: {
        connect: { id: c2niveau1.id },
      },
    },
  });
  const c2n1ac3 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Formaliser et mettre en oeuvre des outils mathématiques pour informatique",
      ordre: 3,
      niveau: {
        connect: { id: c2niveau1.id },
      },
    },
  });
  const c2niveau2 = await prisma.niveau.create({
    data: {
      libelle: "Intermédiaire",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });
  const c2n2ac1 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Choisir des structures de données complexes adaptées au problème",
      ordre: 1,
      niveau: {
        connect: { id: c2niveau2.id },
      },
    },
  });
  const c2n2ac2 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Utiliser des techniques algorithmiques adaptées pour des problèmes complexes",
      ordre: 2,
      niveau: {
        connect: { id: c2niveau2.id },
      },
    },
  });
  const c2n2ac3 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Comprendre les enjeux et moyens de sécurisation des données et du code",
      ordre: 3,
      niveau: {
        connect: { id: c2niveau2.id },
      },
    },
  });
  const c2n2ac4 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Évaluer l\impact environnemental et sociétal des solutions proposées",
      ordre: 3,
      niveau: {
        connect: { id: c2niveau2.id },
      },
    },
  });
  const c2niveau3 = await prisma.niveau.create({
    data: {
      libelle: "Compétent",
      competence: {
        connect: { id: competenceOptiAppli.id },
      },
    },
  });
  const c2n3ac1 = await prisma.apprentissage_critique.create({
    data: {
      libelle: "Anticiper les résultats de diverses métriques",
      ordre: 1,
      niveau: {
        connect: { id: c2niveau3.id },
      },
    },
  });
  const c2n3ac2 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Profiler, analyser et justifier le comportement d'un code existant",
      ordre: 2,
      niveau: {
        connect: { id: c2niveau3.id },
      },
    },
  });
  const c2n3ac3 = await prisma.apprentissage_critique.create({
    data: {
      libelle:
        "Choisir et utiliser des bibliothèques et méthodes dédiées au domaine d'application",
      ordre: 3,
      niveau: {
        connect: { id: c2niveau3.id },
      },
    },
  });

  //Partie EC & enseignements
  const e1p1 = await prisma.enseignement.create({
    data: {
      libelle: "Initiation au développement",
      periode: {
        connect: { id: periode1.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e2p1 = await prisma.enseignement.create({
    data: {
      libelle: "Développement d'interfaces web",
      periode: {
        connect: { id: periode1.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e3p1 = await prisma.enseignement.create({
    data: {
      libelle: "Introduction à l\architecture",
      periode: {
        connect: { id: periode1.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e4p1 = await prisma.enseignement.create({
    data: {
      libelle: "Introduction au système",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
      apprentissages_critiques: {
        connect: [
          { id: n1ac1.id },
          { id: n2ac2.id },
          { id: n3ac1.id },
          { id: n1ac4.id },
        ],
      },
    },
  });
  const e5p1 = await prisma.enseignement.create({
    data: {
      libelle: "Introduction aux bases de données",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e6p1 = await prisma.enseignement.create({
    data: {
      libelle: "Mathématiques discrètes",
      periode: {
        connect: { id: periode3.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e7p1 = await prisma.enseignement.create({
    data: {
      libelle: "Outils fondamentaux",
      periode: {
        connect: { id: periode4.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e8p1 = await prisma.enseignement.create({
    data: {
      libelle: "Introduction à la gestion des organisations",
      periode: {
        connect: { id: periode4.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e9p1 = await prisma.enseignement.create({
    data: {
      libelle: "Introduction à l'économie",
      periode: {
        connect: { id: periode3.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e9p10 = await prisma.enseignement.create({
    data: {
      libelle: "PPP",
      periode: {
        connect: { id: periode1.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e11p1 = await prisma.enseignement.create({
    data: {
      libelle: "Anglais",
      periode: {
        connect: { id: periode1.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e12p1 = await prisma.enseignement.create({
    data: {
      libelle: "Développement Objet",
      periode: {
        connect: { id: periode1.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });

  const e1p2 = await prisma.enseignement.create({
    data: {
      libelle: "Développement d'applications mobiles",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e2p2 = await prisma.enseignement.create({
    data: {
      libelle: "Qualité de développement",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e3p2 = await prisma.enseignement.create({
    data: {
      libelle: "Réseaux & bas niveau",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e4p2 = await prisma.enseignement.create({
    data: {
      libelle: "Services réseaux",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e5p2 = await prisma.enseignement.create({
    data: {
      libelle: "Exploitation bases de données",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e6p2 = await prisma.enseignement.create({
    data: {
      libelle: "Graphes et recherche arborescente",
      periode: {
        connect: { id: periode3.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e7p2 = await prisma.enseignement.create({
    data: {
      libelle: "Statistiques descriptives",
      periode: {
        connect: { id: periode4.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e8p2 = await prisma.enseignement.create({
    data: {
      libelle: "Méthodes numériques",
      periode: {
        connect: { id: periode2.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e9p2 = await prisma.enseignement.create({
    data: {
      libelle: "Intro GSI",
      periode: {
        connect: { id: periode3.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e10p2 = await prisma.enseignement.create({
    data: {
      libelle: "Droit",
      periode: {
        connect: { id: periode4.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e11p2 = await prisma.enseignement.create({
    data: {
      libelle: "Anglais",
      periode: {
        connect: { id: periode3.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e12p2 = await prisma.enseignement.create({
    data: {
      libelle: "Communication techniques",
      periode: {
        connect: { id: periode3.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });
  const e13p2 = await prisma.enseignement.create({
    data: {
      libelle: "PPP",
      periode: {
        connect: { id: periode4.id },
      },
      formation: {
        connect: { id: formationIA.id },
      },
    },
  });

  // Blocs de compétence
  const bcc1 = await prisma.bloc_de_competence.create({
    data: {
      libelle: "Implémentation d'un besoin client",
      version: {
        connect: { id: version10.id },
      },
      credits: 24,
      competences: {
        connect: { id: competenceDevAppli.id },
      },
      apprentissage_critiques: {
        connect: [
          { id: n1ac1.id },
          { id: n2ac2.id },
          { id: n3ac1.id },
          { id: n1ac4.id },
        ],
      },
    },
  });

  const ec1bcc1 = await prisma.element_constitutif.create({
    data: {
      libelle: e4p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc1.id },
      },
      enseignement: {
        connect: { id: e4p1.id },
      },
      volume_horaire_td: 15,
      volume_horaire_cm: 10,
      volume_horaire_tp: 24,
    },
  });
  const ec2bcc1 = await prisma.element_constitutif.create({
    data: {
      libelle: e2p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc1.id },
      },
      enseignement: {
        connect: { id: e2p1.id },
      },
      volume_horaire_td: 11,
      volume_horaire_cm: 35,
      volume_horaire_tp: 21,
    },
  });
  const ec3bcc1 = await prisma.element_constitutif.create({
    data: {
      libelle: e8p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc1.id },
      },
      enseignement: {
        connect: { id: e8p1.id },
      },
      volume_horaire_td: 54,
      volume_horaire_cm: 23,
      volume_horaire_tp: 48,
    },
  });

  const bcc2 = await prisma.bloc_de_competence.create({
    data: {
      libelle: "Découvertes des matières fondamentales",
      version: {
        connect: { id: version10.id },
      },
      credits: 32,
      competences: {
        connect: { id: competenceOptiAppli.id },
      },
      parcours: {
        connect: { id: parcoursIA.id },
      },
      est_tronc_commun: false,
      apprentissage_critiques: {
        connect: [
          { id: n1ac1.id },
          { id: n2ac2.id },
          { id: n3ac1.id },
          { id: n1ac4.id },
        ],
      },
    },
  });

  const ec1bcc2 = await prisma.element_constitutif.create({
    data: {
      libelle: e4p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc1.id },
      },
      enseignement: {
        connect: { id: e4p1.id },
      },
      volume_horaire_td: 15,
      volume_horaire_cm: 10,
      volume_horaire_tp: 24,
    },
  });
  const ec2bcc2 = await prisma.element_constitutif.create({
    data: {
      libelle: e6p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc2.id },
      },
      enseignement: {
        connect: { id: e6p1.id },
      },
      volume_horaire_td: 9,
      volume_horaire_cm: 3,
      volume_horaire_tp: 14,
    },
  });
  const ec3bcc2 = await prisma.element_constitutif.create({
    data: {
      libelle: e7p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc2.id },
      },
      enseignement: {
        connect: { id: e7p1.id },
      },
      volume_horaire_td: 32,
      volume_horaire_cm: 6,
      volume_horaire_tp: 2,
    },
  });
  const ec4bcc2 = await prisma.element_constitutif.create({
    data: {
      libelle: e8p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc2.id },
      },
      enseignement: {
        connect: { id: e8p1.id },
      },
      volume_horaire_td: 16,
      volume_horaire_cm: 6,
      volume_horaire_tp: 8,
    },
  });
  const ec5bcc2 = await prisma.element_constitutif.create({
    data: {
      libelle: e9p1.libelle,
      bloc_de_competence: {
        connect: { id: bcc2.id },
      },
      enseignement: {
        connect: { id: e9p1.id },
      },
      volume_horaire_td: 21,
      volume_horaire_cm: 12,
      volume_horaire_tp: 21,
    },
  });
  console.log('Injection des données terminée.')
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
