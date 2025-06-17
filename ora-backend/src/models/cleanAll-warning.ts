import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetData() {
  console.log("🔄 Reset des données...");

  try {
    // Récupérer les noms des tables via Prisma
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'`;

    // Supprimer les données des tables via une transaction
    await prisma.$transaction(
      tables.map(({ tablename }) =>
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`)
      )
    );

    console.log("✅ Toutes les données ont été supprimées !");
  } catch (error) {
    console.error("Erreur lors du nettoyage des données:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Appel de la fonction de réinitialisation
resetData();
