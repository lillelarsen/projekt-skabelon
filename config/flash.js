module.exports = function (app) {
    app.use(function(req, res, next) {
        req.app.locals.messages = {};
        if(req.session.flash) {
            req.app.locals.messages = req.session.flash;
            delete req.session.flash;
        }
        next();
    });
}