import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'src/models/schema.prisma',

  migrations: {
    path: 'src/models/migrations',
  },

  datasource: {
    url: env('ORA_DATABASE_URL'),
  },
})