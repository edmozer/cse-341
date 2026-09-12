import { openapiDocument } from './swagger.js';

const routeCount = Object.values(openapiDocument.paths).reduce(
  (count, path) => {return count + Object.keys(path).length},
  0
);

if (routeCount !== 10) {
  throw new Error(`Expected 10 documented routes, found ${routeCount}.`);
}

console.log(`Swagger document is valid with ${routeCount} routes.`);
