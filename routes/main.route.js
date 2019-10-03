const { main } = require('../controllers/main.controller.js');

/**
 * @module route/main
 */

module.exports = function(app) {
     /**
     * Denne funktion håndtere GET metoden for endpointet /
     * @param {Function} app Express objekt
     */
        app.get('/', main);
}