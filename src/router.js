import express from 'express';
import {
  adminDashboardHandler,
  currentUserHandler,
  loginHandler,
  logoutHandler,
  registerHandler
} from './controllers/auth.js';
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
import { requireAuth, requireRole } from './middleware/auth.js';

const router = express.Router();

router.post('/auth/register', registerHandler);
router.post('/auth/login', loginHandler);
router.post('/auth/logout', logoutHandler);
router.get('/auth/me', requireAuth, currentUserHandler);
router.get('/admin/dashboard', requireRole('admin'), adminDashboardHandler);

router.get('/authors', getAuthorsHandler);
router.get('/authors/:id', getAuthorByIdHandler);
router.post('/authors', requireRole('admin'), createAuthorHandler);
router.put('/authors/:id', requireRole('admin'), updateAuthorHandler);
router.delete('/authors/:id', requireRole('admin'), deleteAuthorHandler);
router.get('/books', getBooksHandler);
router.get('/books/:id', getBookByIdHandler);
router.post('/books', requireRole('admin'), createBookHandler);
router.put('/books/:id', requireRole('admin'), updateBookHandler);
router.delete('/books/:id', requireRole('admin'), deleteBookHandler);

export default router;
