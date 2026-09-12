import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './src/router.js';
import { openapiDocument } from './src/swagger.js';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use(router);

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Books API is running' });
});

export default app;
