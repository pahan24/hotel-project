const User = require('../models/User');

const showLogin = (req, res) => {
    res.render('pages/admin/login', { error: null });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'Admin' });

        if (!user || !(await user.comparePassword(password))) {
            return res.render('pages/admin/login', { error: 'Invalid email or password' });
        }

        req.session.admin = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.render('pages/admin/login', { error: 'Server error occurred during login' });
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/admin/login');
    });
};

module.exports = { showLogin, login, logout };
