import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthors,
  updateAuthor
} from '../models/authors.js';

const validateAuthor = (author) => {
  if (!author || typeof author !== 'object') {
    return 'A JSON object is required';
  }

  if (
    typeof author.id !== 'string' ||
    author.id.trim() === '' ||
    typeof author.name !== 'string' ||
    author.name.trim() === '' ||
    !Number.isInteger(author.birthYear)
  ) {
    return 'id, name, and birthYear are required';
  }

  return null;
};

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('Could not retrieve authors.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Could not retrieve author.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthorHandler = async (req, res) => {
  const validationMessage = validateAuthor(req.body);
  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  try {
    const existingAuthor = await getAuthorById(req.body.id);
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author ID already exists' });
    }

    await createAuthor(req.body);
    return res.status(201).json(req.body);
  } catch (error) {
    console.error('Could not create author.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthorHandler = async (req, res) => {
  const validationMessage = validateAuthor(req.body);
  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  if (req.body.id !== req.params.id) {
    return res.status(400).json({ message: 'Body ID must match route ID' });
  }

  try {
    const existingAuthor = await getAuthorById(req.params.id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await updateAuthor(req.params.id, req.body);
    return res.status(204).send();
  } catch (error) {
    console.error('Could not update author.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const existingAuthor = await getAuthorById(req.params.id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const result = await deleteAuthor(req.params.id);
    if (result.referenced) {
      return res.status(400).json({
        message: 'Author cannot be deleted while books reference it'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Could not delete author.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createAuthorHandler,
  deleteAuthorHandler,
  getAuthorByIdHandler,
  getAuthorsHandler,
  updateAuthorHandler
};
