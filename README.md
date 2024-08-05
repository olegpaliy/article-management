# Article Management App

An Article Management app built with TypeScript, Next.js, Zod, Prisma, PostgreSQL, JWT, and Material UI. It supports SSR feed parsing, CRUD operations, admin panel authorization, and public route for article display.

## Installation

1. Start with Docker:

   ```bash
   docker compose up -d
   ```

2. Run Prisma Migrations:

   ```bash
   docker exec article-management-app-1 npx prisma migrate dev --name init
   ```

3. Run Prisma Seed:

   ```bash
   docker exec article-management-app-1 yarn run seed
   ```

   To be able to create, update, or delete articles, you need to log in as an admin (email: admin@padmin.io, password: admin).
