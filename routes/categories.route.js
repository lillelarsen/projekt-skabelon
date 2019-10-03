const { showCategoryCreateForm, getCategories, showCategoryForm, editCategory, deleteCategory, createCategory } = require('../controllers/categories.controller');
const isAuthorized = require("../middleware/is-authenticated");
const isEmployee = require('../middleware/is-employee');
const isAdmin = require('../middleware/is-admin');

/**
 * @module route/users
 */

 module.exports = function(app) {
    /**
     * Denne funktion håndtere GET metoden for endpointet /createCategory
     * @param {Function} app Express objekt
     */
    app.get('/createCategory', isAuthorized, isEmployee, showCategoryCreateForm);
    /**
     * Denne funktion håndtere POST metoden der opdaterer for endpointet /category/(den valgte category-id)
     * @param {Function} app Express objekt
     */
    app.post('/createCategory', isAuthorized, isEmployee, createCategory);
     /**
     * Denne funktion håndtere GET metoden for endpointet /categories
     * @param {Function} app Express objekt
     */
      app.get('/categories', isAuthorized, isEmployee, getCategories);
    /**
     * Denne funktion håndtere GET metoden for endpointet /editCategory/(den valgte category-id)
     * @param {Function} app Express objekt
     */
      app.get('/editCategory/:id', isAuthorized, isAdmin, showCategoryForm);
    /**
     * Denne funktion håndtere POST metoden der opdaterer for endpointet /editCategory/(den valgte category-id)
     * @param {Function} app Express objekt
     */
      app.post('/editCategory/:id', isAuthorized, isAdmin, editCategory);
    /**
     * Denne funktion håndtere DELETE metoden der sletter for endpointet /category/(den valgte category-id)
     * @param {Function} app Express objekt
     */
    app.get('/deleteCategory/:id', isAuthorized, isAdmin, deleteCategory);
 }