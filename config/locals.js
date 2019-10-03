const db = require('../config/mysql');

module.exports = function(app) {
    app.use(function(req, res, next) {
        if(typeof req.app.locals.isLoggedIn === "undefined") {
            req.app.locals.isLoggedIn = false;
        }
        req.app.locals.user = req.session.user;
        
        next();
    });
    app.use(function(req, res, next) {
        db.query(`SELECT * FROM globals`, (err, site) => {
			if (err) return next(`${err} at db.query (${__filename}:4:5)`);
			req.app.locals.site = site[0];
            next()
		});	
    })

}
