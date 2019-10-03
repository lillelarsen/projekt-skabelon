const { showUploadForm, uploadImage, showImages, editFormImage, editImage, deleteImage } = require('../controllers/images.controller.js');
const isAuthorized = require("../middleware/is-authenticated");
const isEmployee = require('../middleware/is-employee');
const isAdmin = require('../middleware/is-admin');
/**
 * @module route/users
 */

module.exports = function(app) {
    /**
     * Denne funktion håndtere GET metoden for endpointet /upload
     * @param {Function} app Express objekt
     */
    app.get('/upload', isAuthorized, isEmployee, showUploadForm);

    /**
     * Denne funktion håndtere POST metoden for endpointet /upload
     * @param {Function} app Express objekt
     */
    app.post('/upload', isAuthorized, isEmployee, uploadImage);

    /**
     * Denne funktion håndtere GET metoden for endpointet /images
     * @param {Function} app Express objekt
     */
    app.get('/images', isAuthorized, isEmployee, showImages);

    /**
     * Denne funktion håndtere GET metoden for endpointet /images/:name
     * @param {Function} app Express objekt
     */
    app.get('/images/:id', isAuthorized, isEmployee, editFormImage);

    /**
     * Denne funktion håndtere POST metoden for endpointet /images/:name
     * @param {Function} app Express objekt
     */
    app.post('/images/:id', isAuthorized, isEmployee, editImage);

    /**
     * Denne funktion håndtere GET/DELETE metoden for endpointet /images/:id
     * @param {Function} app Express objekt
     */
    app.get('/images/:id', isAuthorized, isEmployee, deleteImage);
}