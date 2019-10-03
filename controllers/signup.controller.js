const db = require('../config/mysql');
const { hashSync } = require('bcryptjs');
/**
 * @module controller/signup
 */

/**
 * Denne funktion retunerer signup.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */

exports.showSignup = function(req, res, next) {
    res.render('client/signup', { 'title': 'Brugerregistrering', 'content': 'Opret en bruger' });
}

/**
 * Denne funktion poster signup med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.sendSignup = async function(req, res, next) {  

    if(req.fields.email == "") {
        req.session.flash = { 
            emailError:"Email skal udfyldes",
            email: req.fields.email,
            username: req.fields.username  
        };
        res.redirect("/signup");
        return;
    }
    if(req.fields.username == "") {
        req.session.flash = { 
            usernameError:"Brugernavn skal udfyldes",
            email: req.fields.email,
            username: req.fields.username  
        };
        res.redirect("/signup");
        return;
    }


    try {
        const profileSQL = `INSERT INTO profiles
        SET email = :email`;
        const userSQL = `INSERT INTO users
        SET username = :username, password = :password, fk_profile = :fk`;

        const hashedPass = hashSync(req.fields.password, 10);

        const profile = await db.query(profileSQL, { email: req.fields.email });
        const user = await db.query(userSQL, {
            username: req.fields.username,
            password: hashedPass,
            fk: profile[0].insertId
        });
        res.send("Du er nu oprettet som bruger! Tillykke");
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.send("Denne bruger eksisterer allerede")
        }
        console.log(error);
        
        res.send("fejl");
    }
 };