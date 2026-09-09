// needed for drizzle kit (CLI)

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/schema.ts',
    dialect: 'postgresql',
    casing: 'snake_case',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});