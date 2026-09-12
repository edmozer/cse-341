import express from 'express';
import {
  createAuthorHandler,
  deleteAuthorHandler,
  getAuthorByIdHandler,
  getAuthorsHandler,
  updateAuthorHandler
} from './controllers/authors.js';
import {
  createBookHandler,
  deleteBookHandler,
  getBookByIdHandler,
  getBooksHandler,
  updateBookHandler
} from './controllers/books.js';

const router = express.Router();

router.get('/authors', getAuthorsHandler);
router.get('/authors/:id', getAuthorByIdHandler);
router.post('/authors', createAuthorHandler);
router.put('/authors/:id', updateAuthorHandler);
router.delete('/authors/:id', deleteAuthorHandler);
router.get('/books', getBooksHandler);
router.get('/books/:id', getBookByIdHandler);
router.post('/books', createBookHandler);
router.put('/books/:id', updateBookHandler);
router.delete('/books/:id', deleteBookHandler);

export default router;
