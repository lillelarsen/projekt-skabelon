const { getLoginForm, loginCheck, logout } = require('../controllers/login.controller.js');

/**
 * @module route/signup
 */

module.exports = function(app) {
    /**
     * Denne funktion håndtere GET metoden for endpointet /login
     * @param {Function} app Express objekt
     */
    app.get('/login', getLoginForm );
    /**
     * Denne funktion håndtere POST metoden for endpointet /login
     * @param {Function} app Express objekt
     */
    app.post('/login', loginCheck );
    /**
     * Denne funktion håndtere GET metoden for endpointet /logout
     * @param {Function} app Express objekt
     */
    app.get('/logout', logout );

}