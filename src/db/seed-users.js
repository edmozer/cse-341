import bcrypt from 'bcryptjs';
import { connectToDb, getDb } from './connect.js';

const requiredPassword = (name) => {
  if (!process.env[name] || process.env[name].length < 8) {
    throw new Error(`${name} must contain at least 8 characters.`);
  }
  return process.env[name];
};

const seedUsers = async () => {
  await connectToDb();
  const users = [
    {
      id: 'admin-1', name: 'Site Administrator', email: 'admin@example.com', role: 'admin',
      passwordHash: await bcrypt.hash(requiredPassword('ADMIN_PASSWORD'), 12)
    },
    {
      id: 'user-1', name: 'Demo User', email: 'user@example.com', role: 'user',
      passwordHash: await bcrypt.hash(requiredPassword('USER_PASSWORD'), 12)
    }
  ];
  for (const user of users) {
    await getDb().collection('users').updateOne({ id: user.id }, { $set: user }, { upsert: true });
  }
  console.log('Users seeded.');
};

try {
  await seedUsers();
} catch (error) {
  console.error('Could not seed users.', error.message);
  process.exitCode = 1;
}
