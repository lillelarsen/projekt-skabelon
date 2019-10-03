const isAuthenticated = require('../middleware/is-authenticated');
const checkUserId = require('../middleware/checkUserId');
const { showUserForm, editUser } = require('../controllers/users.controller.js');

/**
 * @module route/profile
 */

module.exports = function(app) {
    /**
     * Denne funktion håndtere GET metoden for endpointet /profile
     * @param {Function} isAuthenticated, Autentificering
     * @param {Function} checkUserId, Autentificering af params og session  
     * @param {Function} showUserForm, Vis form 
     */
    app.get("/profile/:id", [isAuthenticated, checkUserId], showUserForm);
    /**
     * Denne funktion håndtere GET metoden for endpointet /profile
     * @param {Function} isAuthenticated, Autentificering 
     * @param {Function} checkUserId, Autentificering af params og session 
     * @param {Function} editUser, Rediger brugeren POST
     */
    app.post("/profile/:id", [isAuthenticated, checkUserId], editUser);


}