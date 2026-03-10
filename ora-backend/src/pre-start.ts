import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve("/app/", '.env');
dotenv.config({ path: envFilePath });
