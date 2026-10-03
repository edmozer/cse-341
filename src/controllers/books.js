import { getAuthorById } from '../models/authors.js';
import {
  createBook,
  deleteBook,
  getBooks,
  getBookById,
  updateBook
} from '../models/books.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const SORT_FIELDS = ['id', 'title', 'publicationDate'];

const parsePositiveInteger = (value, field) => {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return `${field} must be a positive integer`;
  }

  const number = Number(value);
  return Number.isSafeInteger(number)
    ? number
    : `${field} must be a positive integer`;
};

const parseBooksQuery = (query) => {
  const page = parsePositiveInteger(query.page, 'page');
  const limit = parsePositiveInteger(query.limit, 'limit');

  if (typeof page === 'string' || typeof limit === 'string') {
    return { error: page || limit };
  }

  const resolvedPage = page || DEFAULT_PAGE;
  const resolvedLimit = limit || DEFAULT_LIMIT;
  if (resolvedLimit > MAX_LIMIT) {
    return { error: `limit must be at most ${MAX_LIMIT}` };
  }

  const sort = query.sort === undefined ? 'id' : query.sort;
  if (typeof sort !== 'string' || !SORT_FIELDS.includes(sort)) {
    return { error: `sort must be one of: ${SORT_FIELDS.join(', ')}` };
  }

  const order = query.order === undefined ? 'asc' : query.order;
  if (typeof order !== 'string' || !['asc', 'desc'].includes(order)) {
    return { error: 'order must be asc or desc' };
  }

  return {
    value: {
      page: resolvedPage,
      limit: resolvedLimit,
      sort,
      order
    }
  };
};

const buildBooksResponse = ({ books, totalItems, query }) => {
  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    data: books,
    query: {
      sort: query.sort,
      order: query.order
    },
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1 && totalPages > 0
    }
  };
};

const validateBook = (book) => {
  if (!book || typeof book !== 'object') {
    return 'A JSON object is required';
  }

  if (
    typeof book.id !== 'string' ||
    book.id.trim() === '' ||
    typeof book.authorId !== 'string' ||
    book.authorId.trim() === '' ||
    typeof book.title !== 'string' ||
    book.title.trim() === '' ||
    typeof book.publicationDate !== 'string' ||
    book.publicationDate.trim() === ''
  ) {
    return 'id, authorId, title, and publicationDate are required';
  }

  return null;
};

const authorExists = async (authorId) => {
  return Boolean(await getAuthorById(authorId));
};

const getBooksHandler = async (req, res) => {
  const parsedQuery = parseBooksQuery(req.query);
  if (parsedQuery.error) {
    return res.status(400).json({ message: parsedQuery.error });
  }

  try {
    const { page, limit, sort, order } = parsedQuery.value;
    const { books, totalItems } = await getBooks({
      filter: {},
      page,
      limit,
      sort,
      order
    });

    return res.status(200).json(buildBooksResponse({
      books,
      totalItems,
      query: { ...req.query, page, limit, sort, order }
    }));
  } catch (error) {
    console.error('Could not retrieve books.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Could not retrieve book.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  const validationMessage = validateBook(req.body);
  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  try {
    if (!(await authorExists(req.body.authorId))) {
      return res.status(400).json({ message: 'Referenced author does not exist' });
    }

    if (await getBookById(req.body.id)) {
      return res.status(400).json({ message: 'Book ID already exists' });
    }

    await createBook(req.body);
    return res.status(201).json(req.body);
  } catch (error) {
    console.error('Could not create book.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  const validationMessage = validateBook(req.body);
  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  if (req.body.id !== req.params.id) {
    return res.status(400).json({ message: 'Body ID must match route ID' });
  }

  try {
    if (!(await getBookById(req.params.id))) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!(await authorExists(req.body.authorId))) {
      return res.status(400).json({ message: 'Referenced author does not exist' });
    }

    await updateBook(req.params.id, req.body);
    return res.status(204).send();
  } catch (error) {
    console.error('Could not update book.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Could not delete book.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  buildBooksResponse,
  createBookHandler,
  deleteBookHandler,
  getBookByIdHandler,
  getBooksHandler,
  parseBooksQuery,
  updateBookHandler
};
