import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const port = process.env.PORT;

if (!port) {
  throw new Error('PORT is required.');
}

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`Books API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed.', error.message);
    process.exitCode = 1;
  }
};

startServer();
