const db = require('../config/mysql');
/**
 * @module controller/categories
 */

 /**
 * Denne funktion retunerer create-category.ejs
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showCategoryCreateForm = async function(req, res, next) {
    try {
        res.render('admin/create-category', { 'title': 'Opret kategori', 'content': 'Opret kategori i formen'});
    } catch (error) {
        console.log(error);
        res.send("Kan ikke indlæse siden");
    }
}

/**
 * Denne funktion opretter med POST en category
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.createCategory = async function(req, res, next) {
    try {
        const categorySQL = `INSERT INTO categories SET name = :name, description = :description`;
        const category = await db.query(categorySQL, {name: req.fields.name, description: req.fields.description});
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
        res.send("Kan ikke oprette kategori");
    }
}

/**
 * Denne funktion retunerer categories.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.getCategories = async function(req, res, next) {
    try {
        const categorySQL = `SELECT id, name, description FROM categories`;
        const [rows] = await db.query(categorySQL);
        res.render('admin/categories', { 'title': 'Kategorier', 'content': 'en liste over Kategorier', 'categories': rows });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke hente kategorier");
    }
}

/**
 * Denne funktion retunerer edit-category.ejs med data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.showCategoryForm = async function(req, res, next) {
    try {
        const userSQL = `SELECT id, name, description FROM categories WHERE id = :id`;
        const [rows] = await db.query(userSQL, {id: req.params.id});
        res.render('admin/edit-category', { 'title': 'Redigér', 'content': 'Redigér kategorien', 'category': rows[0] });
    } catch (error) {
        console.log(error);
        res.send("Kan ikke finde kategorien");
    }
}

/**
 * Denne funktion opdaterer category data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.editCategory = async function(req, res, next) {
    try {
        const categorySQL = `UPDATE categories SET name = :name, description = :description WHERE id = :id`;
        const user = await db.query(categorySQL, {id: req.params.id, name: req.fields.name, description: req.fields.description});
        res.redirect('/editCategory/' + req.params.id);
    } catch (error) {
        console.log(error);
        res.send("Kan ikke opdatere kategori");
    }
}

/**
 * Denne funktion sletter user data
 * @params {Object} req
 * @params {Function} res
 * @params {Function} next
 */
exports.deleteCategory = async function(req, res, next) {
    try {
        const userSQL = `DELETE FROM categories WHERE id = :id`;

        await db.query(userSQL, {id: req.params.id});
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
        res.send("Kan ikke slette kategori");
    }
}