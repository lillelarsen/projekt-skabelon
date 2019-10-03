const { showSignup, sendSignup } = require('../controllers/signup.controller.js');

/**
 * @module route/signup
 */

module.exports = function(app) {
    /**
     * Denne funktion håndtere GET metoden for endpointet /signup
     * @param {Function} app Express objekt
     */
        app.get('/signup', showSignup);
        app.post('/signup', sendSignup);

}