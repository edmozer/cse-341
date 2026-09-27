const loadSessionUser = (req, res, next) => {
  req.user = req.session.user || null;
  return next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  return next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    return next();
  };
};

export { loadSessionUser, requireAuth, requireRole };
