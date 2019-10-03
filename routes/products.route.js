const { getProducts, showProductForm, editProduct, deleteProduct, showProductCreateForm, createProduct, searchProducts, showProduct, showCategory } = require('../controllers/products.controller.js');
const isAuthorized = require("../middleware/is-authenticated");
const isEmployee = require('../middleware/is-employee');
const isAdmin = require('../middleware/is-admin');

/**
 * @module route/users
 */

module.exports = function(app) {
    /**
     * Denne funktion håndtere GET metoden for endpointet /createProduct
     * @param {Function} app Express objekt
     */
    app.get('/createProduct', isAuthorized, isEmployee, showProductCreateForm);
    /**
     * Denne funktion håndtere POST metoden der opdaterer for endpointet /createProduct/(den valgte Product-id)
     * @param {Function} app Express objekt
     */
    app.post('/createProduct', isAuthorized, isEmployee, createProduct);
    /**
     * Denne funktion håndtere GET metoden for endpointet /products
     * @param {Function} app Express objekt
     */
    app.get('/products', isAuthorized, isEmployee, getProducts);
    /**
     * Denne funktion håndtere GET metoden for endpointet /editProduct/(den valgte Product-id)
     * @param {Function} app Express objekt
     */
    app.get('/editProduct/:id', isAuthorized, isAdmin, showProductForm);
    /**
     * Denne funktion håndtere POST metoden der opdaterer for endpointet /editProduct/(den valgte Product-id)
     * @param {Function} app Express objekt
     */
    app.post('/editProduct/:id', isAuthorized, isAdmin, editProduct);
    /**
     * Denne funktion håndtere DELETE metoden der sletter for endpointet /deleteProduct/(den valgte Product-id)
     * @param {Function} app Express objekt
     */
    app.get('/deleteProduct/:id', isAuthorized, isAdmin, deleteProduct);
    /**
     * Denne funktion håndtere GET metoden for endpointet /produkter
     * @param {Function} app Express objekt
     */
    app.get('/produkter', searchProducts);
    /**
     * Denne funktion håndtere GET metoden for endpointet /produkt/:id
     * @param {Function} app Express objekt
     */
    app.get('/produkt/:id', showProduct);
    /**
     * Denne funktion håndtere GET metoden for endpointet /produkter
     * @param {Function} app Express objekt
     */
    app.get('/produkter/:id', showCategory);
}