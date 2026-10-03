import assert from 'node:assert/strict';
import test from 'node:test';
import { openapiDocument } from './swagger.js';

test('documents the W05 books query contract', () => {
  const getBooks = openapiDocument.paths['/books'].get;
  const parameters = Object.fromEntries(
    getBooks.parameters.map((parameter) => {return [parameter.name, parameter]})
  );

  assert.deepEqual(Object.keys(parameters).sort(), [
    'authorId',
    'limit',
    'order',
    'page',
    'q',
    'sort'
  ]);
  assert.equal(parameters.page.schema.minimum, 1);
  assert.equal(parameters.limit.schema.maximum, 50);
  assert.deepEqual(parameters.sort.schema.enum, ['id', 'title', 'publicationDate']);
  assert.deepEqual(parameters.order.schema.enum, ['asc', 'desc']);
  assert.ok(getBooks.responses[400]);
  assert.equal(
    getBooks.responses[200].content['application/json'].schema.$ref,
    '#/components/schemas/BookList'
  );
});

test('documents book results with query and pagination metadata', () => {
  const bookList = openapiDocument.components.schemas.BookList;

  assert.deepEqual(bookList.required, ['data', 'query', 'pagination']);
  assert.deepEqual(bookList.properties.data.items, {
    $ref: '#/components/schemas/Book'
  });
  assert.equal(bookList.properties.query.$ref, '#/components/schemas/BookQuery');
  assert.equal(bookList.properties.pagination.$ref, '#/components/schemas/Pagination');
});
