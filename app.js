import express from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import router from './src/router.js';
import { loadSessionUser } from './src/middleware/auth.js';
import { openapiDocument } from './src/swagger.js';

const app = express();

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required.');
}

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2
  }
}));
app.use(loadSessionUser);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use(router);

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Books API is running' });
});

export default app;
