const idParameter = (resource) => {return {
  name: 'id',
  in: 'path',
  required: true,
  description: `${resource} ID`,
  schema: { type: 'string' }
}};

const jsonBody = (schema) => {return {
  required: true,
  content: {
    'application/json': {
      schema: { $ref: `#/components/schemas/${schema}` }
    }
  }
}};

const response = (description, schema) => {return {
  description,
  ...(schema
    ? { content: { 'application/json': { schema: { $ref: `#/components/schemas/${schema}` } } } }
    : {})
}};

const collectionResponse = (description, schema) => {return {
  description,
  content: {
    'application/json': {
      schema: {
        type: 'array',
        items: { $ref: `#/components/schemas/${schema}` }
      }
    }
  }
}};

const errorResponse = (description) => {return response(description, 'Error')};

const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'CSE 341 Books and Authors API',
    version: '1.0.0',
    description: 'CRUD API for books and authors with a book-to-author reference.'
  },
  servers: [{ url: '/' }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a regular user',
        requestBody: jsonBody('Credentials'),
        responses: {
          201: response('User registered', 'User'),
          400: errorResponse('Invalid registration data'),
          409: errorResponse('Email already registered')
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Start a session',
        requestBody: jsonBody('Credentials'),
        responses: {
          200: response('Session started', 'User'),
          400: errorResponse('Invalid credentials'),
          401: errorResponse('Invalid email or password')
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'Destroy the current session',
        responses: { 204: response('Session destroyed') }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get the current session user',
        responses: {
          200: response('Authenticated user', 'User'),
          401: errorResponse('Authentication required')
        }
      }
    },
    '/admin/dashboard': {
      get: {
        summary: 'List users for administrators',
        responses: {
          200: response('Admin dashboard returned'),
          401: errorResponse('Authentication required'),
          403: errorResponse('Insufficient permissions')
        }
      }
    },
    '/authors': {
      get: {
        summary: 'List authors',
        responses: {
          200: collectionResponse('Authors returned', 'Author'),
          500: errorResponse('Unexpected server error')
        }
      },
      post: {
        summary: 'Create an author',
        requestBody: jsonBody('Author'),
        responses: {
          201: response('Author created', 'Author'),
          400: errorResponse('Invalid or duplicate author'),
          500: errorResponse('Unexpected server error')
        }
      }
    },
    '/authors/{id}': {
      get: {
        summary: 'Get an author',
        parameters: [idParameter('Author')],
        responses: {
          200: response('Author returned', 'Author'),
          404: errorResponse('Author not found'),
          500: errorResponse('Unexpected server error')
        }
      },
      put: {
        summary: 'Replace an author',
        parameters: [idParameter('Author')],
        requestBody: jsonBody('Author'),
        responses: {
          204: response('Author updated'),
          400: errorResponse('Invalid author or route/body ID mismatch'),
          404: errorResponse('Author not found'),
          500: errorResponse('Unexpected server error')
        }
      },
      delete: {
        summary: 'Delete an unreferenced author',
        parameters: [idParameter('Author')],
        responses: {
          204: response('Author deleted'),
          400: errorResponse('Author is still referenced by a book'),
          404: errorResponse('Author not found'),
          500: errorResponse('Unexpected server error')
        }
      }
    },
    '/books': {
      get: {
        summary: 'List books',
        responses: {
          200: collectionResponse('Books returned', 'Book'),
          500: errorResponse('Unexpected server error')
        }
      },
      post: {
        summary: 'Create a book',
        requestBody: jsonBody('Book'),
        responses: {
          201: response('Book created', 'Book'),
          400: errorResponse('Invalid, duplicate, or unreferenced book author'),
          500: errorResponse('Unexpected server error')
        }
      }
    },
    '/books/{id}': {
      get: {
        summary: 'Get a book',
        parameters: [idParameter('Book')],
        responses: {
          200: response('Book returned', 'Book'),
          404: errorResponse('Book not found'),
          500: errorResponse('Unexpected server error')
        }
      },
      put: {
        summary: 'Replace a book',
        parameters: [idParameter('Book')],
        requestBody: jsonBody('Book'),
        responses: {
          204: response('Book updated'),
          400: errorResponse('Invalid book, route/body ID mismatch, or unknown author'),
          404: errorResponse('Book not found'),
          500: errorResponse('Unexpected server error')
        }
      },
      delete: {
        summary: 'Delete a book',
        parameters: [idParameter('Book')],
        responses: {
          204: response('Book deleted'),
          404: errorResponse('Book not found'),
          500: errorResponse('Unexpected server error')
        }
      }
    }
  },
  components: {
    schemas: {
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          name: { type: 'string', example: 'Demo User' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', format: 'password', example: 'strong-password' }
        }
      },
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role'],
        properties: {
          id: { type: 'string', example: 'user-1' },
          name: { type: 'string', example: 'Demo User' },
          email: { type: 'string', example: 'user@example.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
        }
      },
      Author: {
        type: 'object',
        required: ['id', 'name', 'birthYear'],
        properties: {
          id: { type: 'string', example: 'a1' },
          name: { type: 'string', example: 'Jane Austen' },
          birthYear: { type: 'integer', example: 1775 }
        }
      },
      Book: {
        type: 'object',
        required: ['id', 'authorId', 'title', 'publicationDate'],
        properties: {
          id: { type: 'string', example: 'b1' },
          authorId: { type: 'string', example: 'a1' },
          title: { type: 'string', example: 'Pride and Prejudice' },
          publicationDate: { type: 'string', example: '1813-01-28' }
        }
      },
      Error: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'Resource not found' }
        }
      }
    }
  }
};

export { openapiDocument };
