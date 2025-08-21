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
  console.log('Injection des données de configuration (composants, types, etc) terminée.')
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
