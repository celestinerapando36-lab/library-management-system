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

Each book stores only a `genreId`, a foreign key pointing to a row in the `Genre` table. It does not copy the genre's name inside the book. I chose this for three reasons:

1. **One place to change.** Renaming a genre (for example "Science" to "Natural Science") means editing one `Genre` row. Every book follows automatically, because the books only hold the genre's id. With copied text, I would have to edit every book and could miss some.
2. **No spelling mistakes.** If each book held its own genre text, "Fiction", "fiction" and "Ficton" would count as three different genres. A reference to a single `Genre` row cannot drift.
3. **The database checks it.** The `@relation` on `genreId` makes PostgreSQL enforce that every book points to a real genre. A book with a genre that doesn't exist is rejected, and a genre that still has books can't be deleted by accident.

The trade-off is that reading a book together with its genre needs a join, which Prisma does with `include: { genre: true }`. For a catalog where genres are shared by many books, that cost is small.

**Other decisions**

- `Role` is an enum (`PATRON` or `LIBRARIAN`) instead of a free-text string, so a typo can't create an invalid role. New users default to `PATRON`, the role with the fewest permissions.
- `isbn`, `Genre.name` and `Genre.slug` are `@unique`, so duplicates are rejected.
- The seed script uses `upsert`, so it can run more than once without creating duplicate rows.

## Prisma vs a Document Database

The biggest difference I noticed is that relationships are explicit and enforced. In a document database I could have nested a genre inside each book and changed nothing else. In Prisma I stored only a `genreId` and declared a `@relation`, so PostgreSQL itself rejects a book that points to a genre that doesn't exist. The trade-off is that I had to design the whole structure first and change it through migrations, instead of just saving a document with different fields.

## Project layout

- `api/prisma/`: Prisma schema, migrations and seed script (the database definition).
- `api/src/prisma/`: the NestJS `PrismaService` and `PrismaModule` (how the app connects).
- `api/src/generated/prisma/`: the generated Prisma Client. Rebuild it with `npx prisma generate`.
