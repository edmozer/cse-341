import { getDb } from '../db/connect.js';

const getBooks = async (
  { filter, page, limit, sort, order },
  booksCollection = getDb().collection('books')
) => {
  const sortDirection = order === 'desc' ? -1 : 1;
  const [books, totalItems] = await Promise.all([
    booksCollection
      .find(filter)
      .sort({ [sort]: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    booksCollection.countDocuments(filter)
  ]);

  return { books, totalItems };
};

const getBookById = async (bookId) => {
  return getDb().collection('books').findOne({ id: bookId });
};

const createBook = async (book) => {
  return getDb().collection('books').insertOne(book);
};

const updateBook = async (bookId, book) => {
  return getDb().collection('books').updateOne(
    { id: bookId },
    { $set: book, $unset: { author: '' } }
  );
};

const deleteBook = async (bookId) => {
  return getDb().collection('books').deleteOne({ id: bookId });
};

export {
  createBook,
  deleteBook,
  getBooks,
  getBookById,
  updateBook
};
