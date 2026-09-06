import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  return getDb().collection('books').find({}).toArray();
};

export { getAllBooks };
