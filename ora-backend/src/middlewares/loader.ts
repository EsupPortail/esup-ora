import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../configs/logger';

// Fonction pour charger les variables d'environnement à partir d'un fichier .env
function loadEnv() {
  // Définissez le chemin absolu vers votre fichier .env
  const envFilePath = path.resolve("/app/", '.env');

  // Chargez les variables d'environnement depuis le fichier .env
  const result = dotenv.config({ path: envFilePath });

  if (result.error) {
    throw result.error;
  }

  logger.info('Variables d\'environnement chargées depuis le fichier .env');
}

export default loadEnv;
