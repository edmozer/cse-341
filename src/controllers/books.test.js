import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBooksResponse, parseBooksQuery } from './books.js';

test('uses pagination defaults for a books query', () => {
  assert.deepEqual(parseBooksQuery({}), {
    value: {
      page: 1,
      limit: 10,
      sort: 'id',
      order: 'asc'
    }
  });
});

test('rejects invalid pagination and sorting values', () => {
  assert.equal(parseBooksQuery({ page: '0' }).error, 'page must be a positive integer');
  assert.equal(parseBooksQuery({ limit: '51' }).error, 'limit must be at most 50');
  assert.match(parseBooksQuery({ sort: 'authorId' }).error, /sort must be one of/);
  assert.equal(parseBooksQuery({ order: 'sideways' }).error, 'order must be asc or desc');
});

test('builds metadata for first, middle, last, and empty pages', () => {
  const baseQuery = { limit: 10, sort: 'id', order: 'asc' };
  const response = (page, totalItems) => {return buildBooksResponse({
    books: [],
    totalItems,
    query: { ...baseQuery, page }
  })};

  assert.deepEqual(response(1, 25).pagination, {
    page: 1,
    limit: 10,
    totalItems: 25,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: false
  });
  assert.deepEqual(response(2, 25).pagination, {
    page: 2,
    limit: 10,
    totalItems: 25,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true
  });
  assert.deepEqual(response(3, 25).pagination, {
    page: 3,
    limit: 10,
    totalItems: 25,
    totalPages: 3,
    hasNextPage: false,
    hasPreviousPage: true
  });
  assert.deepEqual(response(1, 0).pagination, {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
});
