import { getAuthorById } from '../models/authors.js';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook
} from '../models/books.js';

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
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
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
  createBookHandler,
  deleteBookHandler,
  getBookByIdHandler,
  getBooksHandler,
  updateBookHandler
};
