import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { createUser, getUserByEmail, getUsers } from '../models/users.js';

const validateCredentials = (body) => {
  if (!body || typeof body !== 'object') return 'A JSON object is required';
  if (typeof body.email !== 'string' || !body.email.includes('@')) {
    return 'A valid email is required';
  }
  if (typeof body.password !== 'string' || body.password.length < 8) {
    return 'Password must contain at least 8 characters';
  }
  return null;
};

const sessionUser = (user) => {
  return { id: user.id, name: user.name, role: user.role };
};

const registerHandler = async (req, res) => {
  const validationMessage = validateCredentials(req.body);
  if (validationMessage || typeof req.body.name !== 'string' || !req.body.name.trim()) {
    return res.status(400).json({ message: validationMessage || 'Name is required' });
  }
  const email = req.body.email.trim().toLowerCase();
  try {
    if (await getUserByEmail(email)) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    const user = await createUser({
      id: randomUUID(),
      name: req.body.name.trim(),
      email,
      role: 'user',
      passwordHash: await bcrypt.hash(req.body.password, 12)
    });
    return res.status(201).json(user);
  } catch (error) {
    console.error('Could not register user.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const loginHandler = async (req, res) => {
  const validationMessage = validateCredentials(req.body);
  if (validationMessage) return res.status(400).json({ message: validationMessage });
  try {
    const user = await getUserByEmail(req.body.email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.session.user = sessionUser(user);
    return res.status(200).json(req.session.user);
  } catch (error) {
    console.error('Could not log in user.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logoutHandler = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Could not log out user.', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.clearCookie('connect.sid');
    return res.status(204).send();
  });
};

const currentUserHandler = (req, res) => { return res.status(200).json(req.user); };

const adminDashboardHandler = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Admin dashboard', users: await getUsers() });
  } catch (error) {
    console.error('Could not load admin dashboard.', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  adminDashboardHandler,
  currentUserHandler,
  loginHandler,
  logoutHandler,
  registerHandler
};
