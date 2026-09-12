import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  return getDb().collection('books').find({}).sort({ id: 1 }).toArray();
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
  getAllBooks,
  getBookById,
  updateBook
};
