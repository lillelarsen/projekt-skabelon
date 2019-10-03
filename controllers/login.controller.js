const db = require('../config/mysql');
const { compareSync } = require('bcryptjs');
/**
 * @module controller/login
 */

/**
 * Denne funktion retunerer signup.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */

exports.getLoginForm = function(req, res, next) {
    res.render('client/login', { 'title': 'Log ind', 'content': 'Log ind via formularen' });
}

exports.loginCheck = async function(req, res, next) {
    try {
        const userSQL = `SELECT id, password FROM users WHERE username = :username`;
        const [rows] = await db.query(userSQL, { username: req.fields.username });
        if(rows.length !== 1) {
            res.redirect('/login');
            return;
        }
        if (!compareSync(req.fields.password, rows[0].password)) {
            res.redirect('/login');
            return;
        }
        req.session.isLoggedIn = true;
        req.session.user = rows[0].id;
        req.app.locals.isLoggedIn = true;
        res.redirect(`/profile/${req.session.user}`);
    } catch (error) {
        console.log(error);
        res.send("fejl");
    }
 };

 exports.logout = function(req, res, next) {
     delete req.session.isLoggedIn;
     delete req.session.user;
     delete req.app.locals.isLoggedIn;
     res.redirect('/login');
 }