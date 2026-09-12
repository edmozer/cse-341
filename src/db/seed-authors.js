import { connectToDb, getDb } from './connect.js';

const authors = [
  { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  { id: 'a2', name: 'George Orwell', birthYear: 1903 },
  { id: 'a3', name: 'Gabriel Garcia Marquez', birthYear: 1927 }
];

const seedAuthors = async () => {
  await connectToDb();
  const authorsCollection = getDb().collection('authors');

  for (const author of authors) {
    await authorsCollection.updateOne(
      { id: author.id },
      { $set: author },
      { upsert: true }
    );
  }

  console.log(`Seeded ${authors.length} authors.`);
};

try {
  await seedAuthors();
} catch (error) {
  console.error('Could not seed authors.', error.message);
  process.exitCode = 1;
}
