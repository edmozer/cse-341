import { connectToDb, getDb } from './connect.js';

const books = [
  {
    id: 'b1',
    authorId: 'a1',
    title: 'Pride and Prejudice',
    publicationDate: '1813-01-28'
  },
  {
    id: 'b2',
    authorId: 'a2',
    title: 'Animal Farm',
    publicationDate: '1945-08-17'
  },
  {
    id: 'b3',
    authorId: 'a3',
    title: 'One Hundred Years of Solitude',
    publicationDate: '1967-05-30'
  }
];

const seedBooks = async () => {
  await connectToDb();
  const booksCollection = getDb().collection('books');

  for (const book of books) {
    await booksCollection.updateOne(
      { id: book.id },
      { $set: book },
      { upsert: true }
    );
  }

  console.log(`Seeded ${books.length} books.`);
};

try {
  await seedBooks();
} catch (error) {
  console.error('Could not seed books.', error.message);
  process.exitCode = 1;
}
