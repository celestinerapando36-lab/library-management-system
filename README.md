# Library Management System

A library catalog API built with NestJS, Prisma and PostgreSQL.

## Setup

1. `cd api`
2. `npm install`
3. Copy `.env.example` to `.env` and put your own PostgreSQL connection string in `DATABASE_URL`.
4. `npx prisma migrate deploy`
5. `npx prisma db seed`
6. `npm run start:dev`

## Data Model

- **User**: has a `Role` of `PATRON` or `LIBRARIAN`.
- **Genre**: a category such as Fiction or Science.
- **Book**: belongs to exactly one Genre through `genreId`.

## Schema Decisions

**Why `Book` references `Genre` instead of embedding it**

Many books share the
same genre, and genres are managed independently of books. Book stores a
`genreId` foreign key with a `@relation` to Genre, so the genre name lives in
one row. Renaming a genre is a single update instead of an edit across every
book, copies can't drift apart ("Sci-Fi" vs "SciFi"), and the foreign key stops
a book from pointing at a genre that doesn't exist.

**Why Role is an enum.** User has a `role` field typed as the `Role` enum
(`PATRON`, `LIBRARIAN`), so both Postgres and TypeScript reject any other
value. It defaults to `PATRON`, which is the least-privileged role.

## Prisma vs a Document Database

The biggest difference I noticed is that relationships are explicit and enforced. In a document database I could have nested a genre inside each book and changed nothing else. In Prisma I stored only a `genreId` and declared a `@relation`, so PostgreSQL itself rejects a book that points to a genre that doesn't exist. The trade-off is that I had to design the whole structure first and change it through migrations, instead of just saving a document with different fields.

## Project layout

- `api/prisma/`: Prisma schema, migrations and seed script (the database definition).
- `api/src/prisma/`: the NestJS `PrismaService` and `PrismaModule` (how the app connects).
- `api/src/generated/prisma/`: the generated Prisma Client. Rebuild it with `npx prisma generate`.
