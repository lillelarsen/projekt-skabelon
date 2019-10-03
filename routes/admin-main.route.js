const { main, editGlobals, editSitelogo, editMainimage } = require('../controllers/admin-main.controller.js');

/**
 * @module route/main
 */

module.exports = function(app) {
        /**
         * Denne funktion håndtere GET metoden for endpointet /
         * @param {Function} app Express objekt
         */
        app.get('/admin', main);

        /**
         * Denne funktion håndtere POST metoden der opdaterer for endpointet /editGlobals
         * @param {Function} app Express objekt
         */
        app.post('/admin', editGlobals);
        
        /**
         * Denne funktion håndtere PATCH metoden der opdaterer for endpointet /admin/sitelogo
         * @param {Function} app Express objekt
         */
        app.patch('/admin/sitelogo', editSitelogo);

        /**
         * Denne funktion håndtere PATCH metoden der opdaterer for endpointet /admin/mainimage
         * @param {Function} app Express objekt
         */
        app.patch('/admin/mainimage', editMainimage);
}