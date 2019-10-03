const db = require('../config/mysql');

module.exports = async function(req, res, next) {
    try {
        const userSQL = `SELECT roles.level FROM users
                        INNER JOIN roles ON users.fk_role = roles.id
                        WHERE users.id = :id`;

        const [rows] = await db.query(userSQL, { id: req.session.user });

        if(rows[0].level >= 50) {
            return next();
        }

        res.redirect('/');
        return;
    } catch (error) {
        res.redirect('/');
        return;
    }
}