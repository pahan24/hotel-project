const isAdmin = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    }
    res.redirect('/admin/login');
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session && req.session.admin) {
        return res.redirect('/admin/dashboard');
    }
    next();
};

module.exports = { isAdmin, redirectIfLoggedIn };
