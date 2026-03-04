function ensureAdmin(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  return next();
}

module.exports = { ensureAdmin };
