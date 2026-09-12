import { getDb } from '../db/connect.js';

const getAuthors = async () => {
  return getDb().collection('authors').find({}).sort({ id: 1 }).toArray();
};

const getAuthorById = async (authorId) => {
  return getDb().collection('authors').findOne({ id: authorId });
};

const createAuthor = async (author) => {
  return getDb().collection('authors').insertOne(author);
};

const updateAuthor = async (authorId, author) => {
  return getDb().collection('authors').updateOne(
    { id: authorId },
    { $set: author }
  );
};

const deleteAuthor = async (authorId) => {
  const bookCount = await getDb().collection('books').countDocuments({ authorId });
  if (bookCount > 0) {
    return { deleted: false, referenced: true };
  }

  const result = await getDb().collection('authors').deleteOne({ id: authorId });
  return { deleted: result.deletedCount === 1, referenced: false };
};

export {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthors,
  updateAuthor
};
