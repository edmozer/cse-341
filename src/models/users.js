import { getDb } from '../db/connect.js';

const publicUser = ({ passwordHash, _id, ...user }) => { return user; };

const getUserByEmail = async (email) => {
  return getDb().collection('users').findOne({ email });
};

const getUsers = async () => {
  const users = await getDb().collection('users').find({}).sort({ email: 1 }).toArray();
  return users.map(publicUser);
};

const createUser = async (user) => {
  await getDb().collection('users').insertOne(user);
  return publicUser(user);
};

export { createUser, getUserByEmail, getUsers };
