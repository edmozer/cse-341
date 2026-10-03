import assert from 'node:assert/strict';
import test from 'node:test';
import { getBooks } from './books.js';

test('uses the same filter for paginated books and total count', async () => {
  const calls = [];
  const booksCollection = {
    find(filter) {
      calls.push(['find', filter]);
      return {
        sort(sort) {
          calls.push(['sort', sort]);
          return this;
        },
        skip(skip) {
          calls.push(['skip', skip]);
          return this;
        },
        limit(limit) {
          calls.push(['limit', limit]);
          return this;
        },
        async toArray() {
          return [{ id: 'b2' }];
        }
      };
    },
    async countDocuments(filter) {
      calls.push(['countDocuments', filter]);
      return 11;
    }
  };
  const filter = { authorId: 'a1' };

  const result = await getBooks({
    filter,
    page: 2,
    limit: 10,
    sort: 'title',
    order: 'desc'
  }, booksCollection);

  assert.deepEqual(result, { books: [{ id: 'b2' }], totalItems: 11 });
  assert.deepEqual(calls, [
    ['find', filter],
    ['sort', { title: -1 }],
    ['skip', 10],
    ['limit', 10],
    ['countDocuments', filter]
  ]);
});
