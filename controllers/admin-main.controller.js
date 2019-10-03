const db = require('../config/mysql');
const fs = require('fs');

const { join } = require('path');
const uploadDir = '../public/images/site-content/';
/**
 * @module controller/admin-home
 */

/**
 * Denne funktion retunerer main.ejs (admin) med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */

exports.main = async (req, res, next) => {
    try {
        const globalSQL = `SELECT id, sitename, sitedescription, sitelogo, maintext, mainimage FROM globals`;
        const [rows] = await db.query(globalSQL);
        res.render('admin/main', { 'title': 'Administrationspanel', 'content': 'Forside', 'global': rows[0] });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke hente globals");
    }
}

/**
 * Denne funktion opdaterer Global data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editGlobals = async function(req, res, next) {
    try {
        const categorySQL = `UPDATE globals SET sitename = :name, sitedescription = :description, maintext = :maintext WHERE id = :id`;
        const user = await db.query(categorySQL, {id: 1, name: req.fields.sitename, description: req.fields.sitedescription, maintext: req.fields.maintext});
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        res.send("Kan ikke opdatere kategori");
    }
}

/**
 * Denne funktion opdaterer Global data (sitelogo)
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editSitelogo = async function(req, res, next) {
    if (!/image/.test(req.files.photo.type)) {
        return res.send('Den uploadede fil er ikke et billede');
    }
    try {
        console.log(req.fields.prev);
        
        const data = fs.readFileSync(req.files.photo.path);
        const newFileName = Date.now() + '_' + req.files.photo.name;
        fs.writeFileSync(join(__dirname, uploadDir + newFileName), data);
        const result = await db.query('UPDATE globals SET sitelogo = :name WHERE id = :id', {name: newFileName, id:1});
        fs.unlinkSync(join(__dirname, uploadDir + req.fields.prevImg));
        res.redirect('/admin');
    } catch (error) {
        return next(error);
    }
}

/**
 * Denne funktion opdaterer Global data (mainimage)
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editMainimage = async function(req, res, next) {
    if (!/image/.test(req.files.photo.type)) {
        return res.send('Den uploadede fil er ikke et billede');
    }
    try {      
        const data = fs.readFileSync(req.files.photo.path);
        const newFileName = Date.now() + '_' + req.files.photo.name;
        fs.writeFileSync(join(__dirname, uploadDir + newFileName), data);
        const result = await db.query('UPDATE globals SET mainimage = :name WHERE id = :id', {name: newFileName, id:1});
        fs.unlinkSync(join(__dirname, uploadDir + req.fields.prevImg));
        res.redirect('/admin');
    } catch (error) {
        return next(error);
    }
}
