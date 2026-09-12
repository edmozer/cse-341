# Week 02 Books and Authors Specification

## Version 1

### Authors

Each author has a text `id`, `name`, and `birthYear`. The API exposes CRUD routes under `/authors`.

### Books

Each book has a text `id`, `authorId`, `title`, and `publicationDate`. The API exposes CRUD routes under `/books`.

### Relationship

Each book references one existing author through `authorId`. A book cannot be created or updated with an unknown author ID.

### Routes

| Resource | Routes |
| --- | --- |
| Authors | `GET /authors`, `GET /authors/:id`, `POST /authors`, `PUT /authors/:id`, `DELETE /authors/:id` |
| Books | `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id` |

### Initial Data

The authors collection includes at least `a1`, `a2`, and `a3`. Starter books reference valid author IDs.

## Version 2: Review and Decisions

### Validation and Status Codes

- `200` is used for successful reads.
- `201` is used when a resource is created.
- `204` is used when a resource is updated or deleted successfully.
- `400` is used for missing or invalid fields and for a book that references an unknown author.
- `404` is used when the requested resource ID does not exist.
- `500` is used for unexpected database or server errors, with a safe general message.
- Required fields are `id`, `name`, and `birthYear` for authors, and `id`, `authorId`, `title`, and `publicationDate` for books.
- IDs are application-provided text values and must be unique within their collection.

### Author Deletion Rule

An author with one or more books cannot be deleted. The API returns `400` with a safe message explaining that the author is still referenced. The client must remove or reassign those books before retrying.

### Review Findings

- Version 1 did not define the response when an author was still referenced, so Version 2 adds an explicit protection rule.
- Version 1 did not distinguish malformed input from a missing resource, so Version 2 defines `400` and `404` separately.
- Error responses must not expose database errors or connection details.
- All write routes must validate required fields before changing the database.
- The OpenAPI documentation must describe request bodies, parameters, response status codes, and safe error responses for every route.

### Testing Plan

- Verify each list, read, create, update, and delete route with valid data.
- Verify `404` responses for unknown book and author IDs.
- Verify `400` responses for missing fields, duplicate IDs, unknown `authorId`, and deleting a referenced author.
- Verify an unexpected database failure returns `500` with a safe general message.
- Run the complete route test set locally and repeat the Swagger checks against the Render deployment.
