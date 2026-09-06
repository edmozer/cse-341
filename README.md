# CSE 341 Books Web Service

Books API created for the W01 assignment.

## Routes

- `GET /books`: returns all books.
- `GET /books/:id`: returns one book, `404` when it does not exist.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Add the MongoDB connection values to `.env`.
4. Run `npm run dev`.

The application requires a MongoDB database named `cse341-books-db` with a `books` collection. Each document must contain `id`, `author`, `title`, and `publicationDate`.

## Checks

```bash
npm run lint
npm test
```

## Assignment submission

The reflection and walk-through links will be added after the GitHub pull requests and video are complete.
