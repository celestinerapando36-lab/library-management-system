import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

const genres = [
  { name: "Fiction", slug: "fiction" },
  { name: "Science", slug: "science" },
  { name: "History", slug: "history" },
  { name: "Technology", slug: "technology" },
];

const books = [
  // Fiction
  { title: "Weep Not, Child", author: "Ngugi wa Thiongo", isbn: "9780435908300", genre: "fiction" },
  { title: "Things Fall Apart", author: "Chinua Achebe", isbn: "9780385474542", genre: "fiction" },
  { title: "Petals of Blood", author: "Ngugi wa Thiongo", isbn: "9780141186887", genre: "fiction" },
  { title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "9780007200283", genre: "fiction" },
  // Science
  { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163", genre: "science" },
  { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "9780198788607", genre: "science" },
  { title: "Cosmos", author: "Carl Sagan", isbn: "9780345539434", genre: "science" },
  { title: "The Origin of Species", author: "Charles Darwin", isbn: "9780451529060", genre: "science" },
  // History
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780393317558", genre: "history" },
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316110", genre: "history" },
  { title: "The Histories", author: "Herodotus", isbn: "9780140449082", genre: "history" },
  { title: "A People's History of the United States", author: "Howard Zinn", isbn: "9780062397348", genre: "history" },
  // Technology
  { title: "The Pragmatic Programmer", author: "Andrew Hunt and David Thomas", isbn: "9780135957059", genre: "technology" },
  { title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", genre: "technology" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", genre: "technology" },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", isbn: "9780201835953", genre: "technology" },
];

async function main() {
  // 1. Genres first, because books point to them
  for (const g of genres) {
    await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
  }

  // 2. Books, looking up each genre's id by its slug
  for (const b of books) {
    const genre = await prisma.genre.findUniqueOrThrow({
      where: { slug: b.genre },
    });
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }

  // 3. Users, one of each role
  await prisma.user.upsert({
    where: { email: "librarian@library.test" },
    update: {},
    create: { email: "librarian@library.test", name: "Head Librarian", role: "LIBRARIAN" },
  });
  await prisma.user.upsert({
    where: { email: "patron@library.test" },
    update: {},
    create: { email: "patron@library.test", name: "Sample Patron", role: "PATRON" },
  });

  console.log(`Seeded ${genres.length} genres, ${books.length} books, 2 users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());