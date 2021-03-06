const db = require('../config/mysql');
const fs = require('fs');

const { join } = require('path');
const uploadDir = '../public/images/uploads/';
/**
 * @module controller/images
 */

 /**
 * Denne funktion retunerer upload-image.ejs
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showUploadForm = function(req, res, next) {
    res.render('admin/upload-image', {title: 'Upload et billede'});
}

 /**
 * Denne funktion poster billede til database + public/images
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.uploadImage = async function(req, res, next) {
    if (!/image/.test(req.files.billede.type)) {
        return res.send('Den uploadede fil er ikke et billede');
    }
    try {
        const data = fs.readFileSync(req.files.billede.path);
        const newFileName = await Date.now() + '_' + req.files.billede.name;
        fs.writeFileSync(join(__dirname, uploadDir + newFileName), data);

        const result = await db.query('INSERT INTO images SET name = ?', [newFileName]);
        
        res.redirect('/images');
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

 /**
 * Denne funktion viser liste over billeder via images.ejs
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showImages = async function(req, res, next) {
    try {
        const imagesSQL = `SELECT id, name FROM images`;
        const [rows] = await db.query(imagesSQL)
        res.render('admin/list-images', { 'images': rows, title: 'Billeder' });
    } catch (error) {
        console.log(error);
        return next(error);
    }
}

 /**
 * Denne funktion viser edit via edit-.ejs
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editFormImage = async function(req, res, next) {
    try {
        if (req.query.action === 'delete') {
            return next();
        }
        const imagesSQL = `SELECT id, name FROM images WHERE id = :id`;
        const [rows] = await db.query(imagesSQL, { id: req.params.id });
        
        res.render('admin/edit-image', { 'image': rows[0], 'title': 'Rediger billede' });
    } catch (error) {
        return next(error);
    }
    
}

/**
 * Denne funktion opdaterer image via /images/:id
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editImage = async function(req, res, next) {
    if (!/image/.test(req.files.billede.type)) {
        return res.send('Den uploadede fil er ikke et billede');
    }
    try {
        const data = fs.readFileSync(req.files.billede.path);
        const newFileName = Date.now() + '_' + req.files.billede.name;
        fs.writeFileSync(join(__dirname, uploadDir + newFileName), data);
        fs.unlinkSync(join(__dirname, uploadDir + req.fields.prevImage));
        const result = await db.query('UPDATE images SET name = :name WHERE id = :id', {name: newFileName, id:req.params.id});
        res.redirect('/images/' + req.params.id);
    } catch (error) {
        return next(error);
    }
}

/**
 * Denne funktion sletter image via /images/:id
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.deleteImage = async function(req, res, next) {
    try {
        const imageSQL = `DELETE FROM images WHERE id = :id`;
        const [rows] = await db.query(imageSQL, {id: req.params.id});
        fs.unlinkSync(join(__dirname, uploadDir + req.query.image));
        res.redirect('/images');
    } catch (error) {
        return next(error);
    }

}