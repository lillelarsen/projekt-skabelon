const db = require('../config/mysql');
/**
 * @module controller/users
 */

/**
 * Denne funktion retunerer users.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.getUsers = async function(req, res, next) {
    try {
        const userSql = `SELECT users.id, username, password, fk_profile, profiles.email FROM users 
                        INNER JOIN profiles ON users.fk_profile = profiles.id`;
        const [rows, fields] = await db.query(userSql);        
        res.render('admin/users', { 'title': 'Brugere', 'content': 'en liste over brugere', 'users': rows });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke hente brugere");
    }
}

/**
 * Denne funktion retunerer edit-user.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showUserForm = async function(req, res, next) {
    try {
        const userSQL = `SELECT users.id, username, password, fk_profile, profiles.email FROM users 
                        INNER JOIN profiles ON users.fk_profile = profiles.id
                        WHERE users.id = :id`;

        const [rows] = await db.query(userSQL, {id: req.params.id});
        res.render('admin/edit-user', { 'title': 'Redigér', 'content': 'Redigér brugeren', 'user': rows[0], isLoggedIn: req.app.locals.isLoggedIn, level: req.app.locals.level });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke finde bruger");
    }
}

/**
 * Denne funktion opdaterer user data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editUser = async function(req, res, next) {
    try {
        const userSQL = `UPDATE users SET username = :username WHERE id = :id`;
        const profileSQL = `UPDATE profiles SET email = :email WHERE id = (
            SELECT fk_profile FROM users WHERE id = :id
        )`;

        const user = await db.query(userSQL, {id: req.params.id, username: req.fields.username});
        const profile = await db.query(profileSQL, {id: req.params.id, email: req.fields.email});
        
        const path = req.route.path.replace(":id", "");

        res.redirect(path + req.params.id);
    } catch (error) {
        console.log(error);
        res.send("Kan ikke opdatere brugere");
    }
}
/**
 * Denne funktion sletter user data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.deleteUser = async function(req, res, next) {
    try {
        const userSQL = `DELETE FROM users WHERE id = :id`;

        await db.query(userSQL, {id: req.params.id});
        res.redirect('/users/');
    } catch (error) {
        console.log(error);
        res.send("Kan ikke slette brugere");
    }
}