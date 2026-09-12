# CSE 341 Books Web Service

Books API created for the CSE 341 Week 02 assignment.

The API stores books and authors in MongoDB. Books reference authors through
`authorId`.

## Routes

- `GET /books`: returns all books.
- `GET /books/:id`: returns one book, `404` when it does not exist.
- `POST /books`: creates a book with an existing author reference.
- `PUT /books/:id`: replaces a book.
- `DELETE /books/:id`: deletes a book.
- `GET /authors`: returns all authors.
- `GET /authors/:id`: returns one author, `404` when it does not exist.
- `POST /authors`: creates an author.
- `PUT /authors/:id`: replaces an author.
- `DELETE /authors/:id`: deletes an unreferenced author.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Add the MongoDB connection values to `.env`.
4. Run `npm run dev`.

The application requires a MongoDB database named `cse341-books-db` with `books` and `authors` collections. Book documents contain `id`, `authorId`, `title`, and `publicationDate`. Author documents contain `id`, `name`, and `birthYear`.

Use `npm run seed:authors` to create the starter authors `a1`, `a2`, and `a3`.
Use `npm run seed:books` to create starter books `b1`, `b2`, and `b3` with valid author references.

OpenAPI documentation is available at `/api-docs`. Run `npm run swagger` to verify that all ten API routes are documented.

## Checks

```bash
npm run lint
npm test
```

## Assignment submission

The reflection and walk-through links will be added after the GitHub pull requests and video are complete.
