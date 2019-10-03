const session = require('express-session');

module.exports = function(app) {
    app.use(session({
        secret: '2k3l4hjb3kh43klh5jl43k5hkljkl',
        resave: true,
        saveUninitialized: true
    }));
};
